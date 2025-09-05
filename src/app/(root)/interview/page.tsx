import Agent from "@/components/shared/Agent";

const Page = async () => {
  // New demo user data
  // const demoUser = {
  //   name: "Nikhil",
  //   id: "567b7c11-62f6-4835-aa8e-f9c288e9589e",
  //   profileURL: "https://via.placeholder.com/150",
  // };

  // // New demo interview request
  // const demoInterview = {
  //   role: "Frontend Developer",
  //   level: "Junior",
  //   techstack: ["React.js", "Next.js", "Tailwind CSS", "TypeScript"],
  //   type: "Technical",
  //   amount: 3, // number of interview questions
  //   userId: demoUser.id,
  // };

  return (
    <>
      <h3>Interview Generation</h3>

      <Agent/>
    </>
  );
};

export default Page;
