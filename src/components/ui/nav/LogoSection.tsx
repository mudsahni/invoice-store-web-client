import {APPLICATION_NAME} from "@/constants/app";
import React from "react";
import Link from "next/link";

export const LogoSection = () => {
    return (
        <div className="flex items-center shrink-0">
            <img
                alt={APPLICATION_NAME}
                src={"/logo.png"}
                className="h-14 opacity-80 w-auto hover:cursor-pointer hover:opacity-100 hover:scale-110 transition duration-300 ease-in-out"
            />
            <Link
                className={`ml-4 text-3xl font-normal tracking-normal text-theme-text`}
                href={"/dashboard"}
            >
                              {APPLICATION_NAME}
                            </Link>

        </div>

    )
}
