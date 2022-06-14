import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { getTasks } from '../config/dynamodb';
import useSend from '../hooks/useSend';
import Spinner from '../components/Spinner';
import { GetServerSideProps } from 'next';
import Task from '../interfaces/Task.interface';

interface Props {
  taskState: Task[];
}

const Home: React.FC<Props> = ({ taskState }) => {
  const [tasks, setTasks] = useState(taskState);
  const [title, setTitle] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [statusMsg, setStatusMsg] = useState({
    type: 'none',
    msg: '',
    empty: true,
  });
  const [sendAddTask, isAdding] = useSend();
  const [sendDeleteTask, isDeleting, deleteError] = useSend();
  const [sendUpdateTask, isUpdating, updateError] = useSend();
  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const addTask = async () => {
    if (title.length == 0) {
      setStatusMsg({
        type: 'error',
        msg: 'Please enter a task!',
        empty: false,
      });
      setTimeout(() => setStatusMsg({ type: 'none', msg: '', empty: true }), 3000);
      return;
    }
    const { data } = await sendAddTask('/api/tasks/addTask', {
      method: 'POST',
      body: JSON.stringify({ title, completed: false }),
    });
    if (data) {
      setStatusMsg({
        type: 'success',
        msg: 'Task added successfully 🥳',
        empty: false,
      });
      setTasks([{ id: data.id, title, completed: false }, ...tasks]);
      setTimeout(() => setStatusMsg({ type: 'none', msg: '', empty: true }), 3000);
      setTitle('');
    }
  };

  const deleteTask = async (task: Task) => {
    const id = task.id;
    setTasks([...tasks.filter((task) => task.id != id)]);
    await sendDeleteTask('/api/tasks/deleteTask', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
    if (deleteError) {
      setTasks([task, ...tasks]);
    }
  };

  const updateTask = async (task: Task) => {
    const id = task.id;
    setTasks(tasks.map((task) => (task.id == id ? { ...task, completed: !task.completed } : task)));
    await sendUpdateTask('/api/tasks/updateTask', {
      method: 'POST',
      body: JSON.stringify({ id, completed: !task.completed }),
    });
    if (updateError) {
      setTasks(
        tasks.map((task) => (task.id == id ? { ...task, completed: !task.completed } : task))
      );
    }
  };

  return (
    <Layout>
      <Head>
        <title>Tasks</title>
      </Head>
      <div className='p-5 h-auto w-11/12 md:w-[450px]  shadow-md rounded-md border-2 border-gray-400 flex flex-col items-center justify-start mt-[20vh]'>
        <div className='flex justify-between items-center mb-7 w-full'>
          <h1 className='font-bold text-gray-700 text-2xl'>Your tasks</h1>
          <button
            className={`rounded-full ${
              isFormVisible ? 'bg-red-500' : 'bg-green-500'
            }  w-12 h-12 flex items-start justify-center hover:scale-105 shadow-md hover:shadow-lg`}
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            <span className='text-4xl text-white font-bold '>
              {isFormVisible ? <>&#xd7;</> : <>&#43;</>}
            </span>
          </button>
        </div>
        {isFormVisible && (
          <>
            <textarea
              disabled={isAdding}
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className='w-full border-2 border-gray-400 rounded-md p-3 font-bold mb-4 shadow-md'
            ></textarea>
            <div className='flex items-start w-full justify-between'>
              <p
                className={`${
                  statusMsg.type == 'error' ? 'text-red-600' : 'text-green-500'
                } font-bold`}
              >
                {!statusMsg.empty && statusMsg.msg}
              </p>
              <button
                onClick={addTask}
                disabled={isAdding}
                className='bg-green-500 h-[50px] font-bold text-white rounded-md shadow-md hover:scale-105 mb-4 text-base disabled:cursor-not-allowed w-[100px] flex items-center justify-center hover:shadow-lg'
              >
                <span className='text-lg'>ADD</span>
                {isAdding ? (
                  <span className='text-4xl ml-3 '>
                    <Spinner />
                  </span>
                ) : (
                  <span className='text-4xl ml-3 pb-2'>&#43;</span>
                )}
              </button>
            </div>
          </>
        )}
        <h1 className='font-bold text-gray-700 text-xl self-start my-4'>Pending</h1>

        <ul className='self-start w-full '>
          {pendingTasks.length === 0 ? (
            <p>No Pending tasks 🥳</p>
          ) : (
            pendingTasks.map((task) => (
              <li
                key={task.id}
                className='border-2 border-gray-400 py-2 px-4 font-bold rounded-md shadow-md mb-4 flex items-center justify-between '
              >
                <p className='w-4/5 '>{task.title}</p>
                <button
                  className='rounded-full bg-red-500   w-6 h-6 flex items-start justify-center hover:scale-105 '
                  onClick={() => deleteTask(task)}
                >
                  <span className=' text-white font-extrabold '>{<>&#xd7;</>}</span>
                </button>
                <button
                  className='rounded-full bg-green-500 ml-3  w-6 h-6 flex items-start justify-center hover:scale-105 '
                  onClick={() => {
                    updateTask(task);
                  }}
                >
                  <span className=' text-white font-extrabold '>{<>&#10003;</>}</span>
                </button>
              </li>
            ))
          )}
        </ul>
        <h1 className='font-bold text-gray-700 text-xl self-start my-4'>Completed</h1>
        <ul className='self-start w-full '>
          {completedTasks.length === 0 ? (
            <p>No completed tasks</p>
          ) : (
            completedTasks.map((task) => (
              <li
                key={task.id}
                className='border-2 border-gray-400 py-2 px-4 font-bold rounded-md shadow-md mb-4 flex items-center justify-between '
              >
                <p className='w-4/5 text-gray-500 '>
                  {' '}
                  <strike className='decoration-2'>
                    <i>{task.title}</i>
                  </strike>
                </p>
                <button
                  className='rounded-full bg-red-500   w-6 h-6 flex items-start justify-center hover:scale-105 '
                  onClick={() => {
                    deleteTask(task);
                  }}
                >
                  <span className=' text-white font-extrabold '>{<>&#xd7;</>}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  // handle error case
  const { Items: taskState } = (await getTasks()) as any;
  return {
    props: {
      taskState,
    },
  };
};
