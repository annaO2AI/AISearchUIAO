import Image from 'next/image';
import {
  LoganimationsIcon,
} from "../chat-ui/components/icons"

export default function AboutPage() {
  return (
    <div>
      <section className="text-left pt-6 mt-6">
        <h1 className="max-w-7xl mx-auto pt-6 mt-6 text-xl font-semibold ot-title">About Us</h1>
      </section>
       <section className="py-6 ">
          <div className="max-w-7xl mx-auto  bg-white rounded-2xl boxshadow p-12 grid  grid-cols-2 md:grid-cols-2 gap-2 items-center relative">
            {/* Text content */}
            <div>
              <h2 className="text-2xl md:text-2xl font-semibold  mb-4 ot-title">Vision</h2>
              <p className="text-lg leading-relaxed osubtitle">
                At <span className="font-semibold text-gray-900">O2</span> our vision is a world where AI will prompt and extend
                anthropoid cognition so institutions and individuals can live up to their potential. Technology seamlessly enhances
                the individual journey to well-being.
              </p>
            </div>

            {/* Image or illustration */}
            <div className="flex justify-center md:justify-center">

            <Image
              src="/visionaryTechnology.gif"
              alt="AI Vision Illustration"
              width={230}
              height={230}
            />
            </div>
             <Image
              src="/about-less.svg"
              alt="About"
              width={1040}
              height={500}
              className='absolute top-[-15px] left-[17px]'
            />
          </div>
         
       </section>
       <section className="py-6">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl boxshadow p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Illustration on left */}
            <div className="flex justify-center md:justify-center">
            <Image
              src="/Innovation.gif"
              alt="Mission Illustration"
              width={253}
              height={253}
            />
            </div>

            {/* Text content on right */}
            <div>
              <h2 className="text-2xl md:text-2xl font-semibold  mb-4 ot-title">Mission</h2>
              <p className="text-lg leading-relaxed osubtitle">
                Our mission is to advance healthcare, pioneering an AI platform that allows healthcare organizations to build delightful
                human-centered knowledge with data, with the oversight and governance of this powerful technology.
              </p>
            </div>
          </div>
       </section>
       <section className="py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: AI Represents */}
          <div className="bg-white rounded-2xl boxshadow p-8 flex items-center gap-4">
            <LoganimationsIcon width={400} />
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">AI represents</h3>
              <p className="text-gray-700 text-base leading-relaxed">
                The rise of generative AI represents a fundamental shift in the industry’s pursuit of a more efficient, scalable,
                and patient-centric system. Yet healthcare’s relationship with technology has always been unique. Business needs,
                not technological innovation alone, typically drive advancement.
              </p>
            </div>
          </div>

          {/* Card 2: Goal */}
          <div className="bg-white rounded-2xl boxshadow p-8 flex items-center gap-4">
             <Image
              src="/goal.png"
              alt="Mission Illustration"
              width={140}
              height={69}
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Goal</h3>
              <p className="text-base leading-relaxed osubtitle">
                At O2, our investing thesis centers on compelling technology and commercial potential to scale within healthcare’s
                complex ecosystem. Our goal is to provide healthcare AI with the necessary insights to inform their market readiness
                and empower payer and provider leaders with valuable takeaways as they build and invest in their AI strategies.
              </p>
            </div>
          </div>
        </div>
       </section>
       <section className="py-6 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Title */}
            <p className="text-lg md:text-xl font-semibold text-gray-800 mt-6">
              At O2, we utilize AI to empower organizations to foster collaborative <br/>thinking and accelerate workplace innovation by:
            </p>

            {/* Grid of Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1 */}
              <div className="bg-[#377dff] text-white rounded-lg py-6 px-4 flex flex-col items-center justify-center">
                 <Image
                  src="/AnalyzingData.svg"
                  alt="Mission Illustration"
                  width={52}
                  height={31}
                  className="w-8 h-8 mb-2"
                />
                <span className="font-semibold text-lg">Analyzing Data</span>
              </div>

              {/* Box 2 */}
              <div className="bg-[#54c3ff] text-white rounded-lg py-6 px-4 flex flex-col items-center justify-center">
                <Image
                  src="/CollectingInsights.svg"
                  alt="Mission Illustration"
                  width={36}
                  height={36}
                  className="w-8 h-8 mb-2"
                />
                <span className="font-semibold text-lg">Collecting Insights</span>
              </div>

              {/* Box 3 */}
              <div className="bg-[#a365d6] text-white rounded-lg py-6 px-4 flex flex-col items-center justify-center">
                 <Image
                  src="/_AutomateTasks.svg"
                  alt="Mission Illustration"
                  width={30}
                  height={44}
                  className="w-8 h-8 mb-2"
                />
                <span className="font-semibold text-lg">Automate Tasks</span>
              </div>
            </div>

            {/* Description Below Grid */}
            <div className="text-gray-700 text-base leading-relaxed pt-12">
              <p>
                Create Something New from What is Learned by leveraging agile frameworks and <strong>building algorithms</strong> to improve
                <strong> business process</strong> efficiencies, we maximize output while minimizing effort.
              </p>
              <p className="mt-3">
                By breathing new life into your processes and practices, we help businesses <strong>grow organically.</strong>
              </p>
            </div>
          </div>
        </section>
    </div>
  )
}
