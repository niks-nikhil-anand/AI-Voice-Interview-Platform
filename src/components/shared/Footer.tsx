import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
    return (
        <footer className="py-6 mt-12 w-full">
            <div className="flex flex-col md:flex-row justify-between items-center blue-gradient-dark rounded-full p-4 w-full px-10 max-w-[1200px] mx-auto gap-4 md:gap-0">
                <Link href={"/"} className="flex items-center gap-2">
                    <Image src={"/logo.svg"} height={32} width={38} alt="Logo" />
                    <h2 className="text-primary-100 font-bold text-lg">Prepwise</h2>
                </Link>

                <div className="text-primary-100/80 text-sm font-medium">
                    © {new Date().getFullYear()} Prepwise. All rights reserved.
                </div>

                <div className="flex gap-6 text-primary-100/80 text-sm font-medium">
                    <Link href={"#"} className="hover:text-primary-100 transition-colors">Privacy Policy</Link>
                    <Link href={"#"} className="hover:text-primary-100 transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
