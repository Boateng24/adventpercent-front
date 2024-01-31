

const Footer = () => {
  return (
    <footer className="flex h-24 p-8 justify-between items-end self-stretch">
      <p className="text-gray-500 font-inter text-sm font-normal leading-5">
        © ADVENT PERCENT APP 2023
      </p>
      <div className="mail flex items-center gap-2">
        <img src="/assets/mail.svg" alt="email" />
        <p className="text-gray-500 font-inter text-sm font-normal leading-5">adventpercent@gmail.com</p>
      </div>
    </footer>
  );
}

export default Footer