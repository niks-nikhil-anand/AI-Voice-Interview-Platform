import { getInterviews } from "@/lib/actions/interview";
import InterviewCard from "./shared/InterviewCard";

const InterviewSection = async () => {
  // Direct call works in server components
  const interviews = await getInterviews();

  // Log on server (check your terminal where Next.js is running)
  console.log("Fetched interviews:", interviews);

  return (
    <>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="flex md:flex-row flex-col gap-5">
          {interviews.length > 0 ? (
            interviews
              .slice(0, 3)
              .map((interview) => (
                <InterviewCard key={interview.id} {...interview} />
              ))
          ) : (
            <p>You haven&apos;t taken any interviews yet.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default InterviewSection;
