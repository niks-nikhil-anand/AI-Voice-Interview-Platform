import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const AboutPage = () => {
    return (
        <div className="flex flex-col gap-12 pb-12">
            {/* Hero Section */}
            <section className="card-cta relative overflow-hidden">
                <div className="flex flex-col gap-6 max-w-2xl z-10">
                    <h1 className="text-4xl font-extrabold text-white">
                        Supporting <span className="text-primary-100">Excellence</span> & Career Growth
                    </h1>
                    <p className="text-lg text-white/90 leading-relaxed">
                        The purpose of this application is to support and prepare my loved one,{" "}
                        <span className="font-semibold text-primary-100">Tripiti Shakya Ji</span>,
                        for her career growth and professional success.
                    </p>
                    <Button asChild className="btn-primary w-fit">
                        <Link href={"/interview"}>Start Practicing Now</Link>
                    </Button>
                </div>
                {/* Decorative background element */}
                <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                    <Image src="/logo.svg" width={300} height={300} alt="bg-logo" />
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Communication */}
                <div className="card p-6 flex flex-col gap-4 border border-dark-300">
                    <div className="rounded-full bg-primary-100/10 p-3 w-fit">
                        <span className="text-2xl">🗣️</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">English Communication</h3>
                    <ul className="list-disc list-inside text-light-100 mt-2 space-y-2">
                        <li>Practice daily English conversations</li>
                        <li>Improve fluency and confidence</li>
                    </ul>
                </div>

                {/* Interviews */}
                <div className="card p-6 flex flex-col gap-4 border border-dark-300">
                    <div className="rounded-full bg-primary-100/10 p-3 w-fit">
                        <span className="text-2xl">🤝</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Interview Prep</h3>
                    <ul className="list-disc list-inside text-light-100 mt-2 space-y-2">
                        <li>Prepare for HR and technical interviews</li>
                        <li>Mock interview practice sessions</li>
                    </ul>
                </div>

                {/* Frontend */}
                <div className="card p-6 flex flex-col gap-4 border border-dark-300">
                    <div className="rounded-full bg-primary-100/10 p-3 w-fit">
                        <span className="text-2xl">🎨</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Frontend Development</h3>
                    <ul className="list-disc list-inside text-light-100 mt-2 space-y-2">
                        <li>HTML fundamentals and best practices</li>
                        <li>CSS layouts and responsive design</li>
                        <li>Tailwind CSS for modern UI development</li>
                    </ul>
                </div>

                {/* Backend */}
                <div className="card p-6 flex flex-col gap-4 border border-dark-300">
                    <div className="rounded-full bg-primary-100/10 p-3 w-fit">
                        <span className="text-2xl">⚙️</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Backend Development</h3>
                    <ul className="list-disc list-inside text-light-100 mt-2 space-y-2">
                        <li>Node.js fundamentals</li>
                        <li>Express.js for building APIs</li>
                        <li>Understanding server-side architecture</li>
                    </ul>
                </div>

                {/* DevOps */}
                <div className="card p-6 flex flex-col gap-4 md:col-span-2 border border-dark-300">
                    <div className="rounded-full bg-primary-100/10 p-3 w-fit">
                        <span className="text-2xl">🚀</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">DevOps & Deployment</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ul className="list-disc list-inside text-light-100 mt-2 space-y-2">
                            <li>Docker containerization</li>
                            <li>AWS S3 for storage</li>
                        </ul>
                        <ul className="list-disc list-inside text-light-100 mt-2 space-y-2">
                            <li>AWS ECS for deployment</li>
                            <li>AWS ECR for container registry</li>
                        </ul>
                    </div>
                </div>

            </section>

            {/* Closing Statement */}
            <section className="bg-dark-200/50 p-8 rounded-2xl border border-dark-300 text-center">
                <h2 className="text-2xl font-bold mb-4 text-white">Our Vision</h2>
                <p className="max-w-3xl mx-auto text-light-100 leading-relaxed">
                    The main goal of this application is to build her confidence, technical expertise, communication ability, and interview readiness so that she can successfully secure a frontend or full-stack developer role.
                    <br /><br />
                    <span className="text-primary-100 font-medium">This application is built with dedication, support, and the vision of long-term career success.</span>
                </p>
            </section>
        </div>
    );
};

export default AboutPage;
