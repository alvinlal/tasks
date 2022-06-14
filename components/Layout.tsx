type Props = { children: React.ReactNode };

const Layout: React.FC<Props> = ({ children }) => {
  return <div className='flex items-start justify-center w-full h-auto pb-24 '>{children}</div>;
};

export default Layout;
