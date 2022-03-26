import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { getTasks } from '../config/dynamodb';
import useSend from '../hooks/useSend';
import Spinner from '../components/Spinner';

export default function Home({ taskState }) {
  const [tasks, setTasks] = useState(taskState);
  const [title, setTitle] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [statusMsg, setStatusMsg] = useState({
    type: 'none',
    msg: '',
    empty: true,
  });
  const { send, isLoading } = useSend();

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
    const { data } = await send(`/api/tasks/addTask`, {
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
  console.log(isLoading);
  return (
    <Layout>
      <Head>
        <title>Tasks</title>
      </Head>
      <div className='p-5 h-auto w-11/12 md:w-[400px]  shadow-md rounded-md border-2 border-gray-400 flex flex-col items-center justify-start mt-[20vh]'>
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
              disabled={isLoading}
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
                disabled={isLoading}
                className='bg-green-500 h-[50px] font-bold text-white rounded-md shadow-md hover:scale-105 mb-4 text-base disabled:cursor-not-allowed w-[100px] flex items-center justify-center hover:shadow-lg'
              >
                <span className='text-lg'>ADD</span>
                {isLoading ? (
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
          {tasks.map(
            (task) =>
              !task.completed && (
                <li
                  key={task.id}
                  className='border-2 border-gray-400 py-2 pl-4 font-bold rounded-md shadow-md mb-4'
                >
                  {task.title}
                </li>
              )
          )}
        </ul>
        <h1 className='font-bold text-gray-700 text-xl self-start my-4'>Completed</h1>
        <ul className='self-start w-full '>
          {tasks.map(
            (task) =>
              task.completed && (
                <li
                  key={task.id}
                  className='border-2 border-gray-400 py-2 pl-4 font-bold rounded-md shadow-md mb-4 text-gray-500'
                >
                  <strike className='decoration-2'>
                    <i>{task.title}</i>
                  </strike>
                </li>
              )
          )}
        </ul>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  // handle error case
  const { Items: taskState } = await getTasks();
  return {
    props: {
      taskState,
    },
  };
}
