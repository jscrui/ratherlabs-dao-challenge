
import Logo from '../../assets/logo.svg';

const Navbar = () => {
  return (
    <header aria-label="Site Header" className="bg-white">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        
        {/** Logo */}
        <a href='/'>
          <img src={Logo} alt="" />
        </a>

        {/** Menu */}
        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Site Nav" className="hidden md:block">            
          </nav>

          {/** Buttons */}
          <div className="flex items-center gap-4">
            <w3m-core-button></w3m-core-button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
