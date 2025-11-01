import Link from "next/link";

type NavItem = {
  href: string;
  text: string;
};

export default function Navbar() {
  return (
    <nav className="fixed flex flex-row items-center justify-baseline w-full h-auto py-2 px-20 gap-2 bg-black">
      {navItems.map(({ href, text }) => (
        <NavbarButton key={href} href={href} text={text}></NavbarButton>
      ))}
    </nav>
  );
}

function NavbarButton({ href, text }: NavItem) {
  return (
    <div className="px-8 py-2 border border-white rounded-2xl">
      <Link href={href}>
        <p className="text-2xl text-white">{text}</p>
      </Link>
    </div>
  );
}

export const navItems: NavItem[] = [
  {
    href: "/",
    text: "Home",
  },
  {
    href: "/about",
    text: "About",
  },
];
