import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import useSWR from 'swr';
// import fetcher from '../utils/fetcher';

const fetcher = url => fetch(url).then(res => res.json());

export default function Home() {
  const { data: tasks, error } = useSWR('/api/tasks', fetcher);
  const [isFormVisible, setIsFormVisible] = useState(false);

  if (error) return 'Something went wrong, please try again later. ';

  return (
    <Layout>
      <Head>
        <title>Tasks</title>
      </Head>
      <div className="p-5 h-auto w-11/12 md:w-[400px] shadow-md rounded-md border-2 border-gray-400 flex flex-col items-center justify-start mt-[20vh]">
        <div className="flex justify-between items-center mb-7 w-full">
          <h1 className="font-bold text-gray-700 text-2xl">Your tasks</h1>
          <button className={`rounded-full ${isFormVisible ? 'bg-red-500' : 'bg-green-500'}  w-12 h-12 flex items-start justify-center hover:scale-105 shadow-md`} onClick={() => setIsFormVisible(!isFormVisible)}>
            <span className="text-4xl text-white font-bold ">{isFormVisible ? <>&#xd7;</> : <>&#43;</>}</span>
          </button>
        </div>
        {isFormVisible && (
          <>
            <textarea className="w-full border-2 border-gray-400 rounded-md p-3 font-bold mb-4 shadow-md"></textarea>
            <button className="self-end bg-green-500 px-4 font-bold text-white rounded-md shadow-md hover:scale-105 mb-4 flex items-center justify-center text-base">
              ADD <span className="font-bold ml-2 text-4xl pb-2">&#43;</span>
            </button>
          </>
        )}
        <ul className="self-start w-full ">
          {!tasks ? (
            <>
              <li className=" h-9 w-full  mb-4 bg-slate-300 animate-pulse"></li>
              <li className=" h-9 w-full  mb-4 bg-slate-300 animate-pulse"></li>
              <li className=" h-9 w-full  mb-4 bg-slate-300 animate-pulse"></li>
            </>
          ) : (
            tasks.map(
              (task, index) =>
                !task.completed && (
                  <li key={index} className="border-2 border-gray-400 py-2 pl-4 font-bold rounded-md shadow-md mb-4">
                    {task.title}
                  </li>
                )
            )
          )}
        </ul>
        <h1 className="font-bold text-gray-700 text-xl self-start my-4">Completed</h1>
        <ul className="self-start w-full ">
          {!tasks ? (
            <>
              <li className=" h-9 w-full  mb-4 bg-slate-300 animate-pulse"></li>
              <li className=" h-9 w-full  mb-4 bg-slate-300 animate-pulse"></li>
              <li className=" h-9 w-full  mb-4 bg-slate-300 animate-pulse"></li>
            </>
          ) : (
            tasks.map(
              (task, index) =>
                task.completed && (
                  <li key={index} className="border-2 border-gray-400 py-2 pl-4 font-bold rounded-md shadow-md mb-4">
                    {task.title}
                  </li>
                )
            )
          )}
        </ul>
      </div>
    </Layout>
  );
}
