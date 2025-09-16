import * as React from "react";
import { type HeadFC, type PageProps } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";

const ConvinceYourBossPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <section className="bg-white py-8">
        <div className="mx-auto max-w-4xl px-6 text-left sm:text-justify">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            Convince Your Boss
          </h1>
          <p className="text-lg text-gray-700 mx-auto mb-12 leading-relaxed">
            The Cloud Native Denmark 2025 conference is the premier technical
            event in the region for any team serious about Kubernetes and
            cloud-native technologies. It is an evolution of the highly
            acclaimed{" "}
            <a
              href="https://2024.kcddenmark.dk/"
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              Kubernetes Community Days Denmark
            </a>
            , which in 2024 brought together over <strong>500 attendees</strong>{" "}
            at the Bella Center in Copenhagen for two packed days of technical
            talks and community connection. This year, it's the same passionate
            community and organizers, just with a new name and a new city. The
            mission remains the same: to share deep technical knowledge and
            build the cloud-native community.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            The ROI: What’s in It for Your Team?
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            It's not just about listening to talks; it's about finding clever
            and inspiring solutions to real business problems. Your focus at the
            conference should be on three things:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 space-y-4">
            <li>
              <strong>Direct Problem-Solving:</strong> The conference is packed
              with technical deep dives on observability, security, CI/CD, and
              cluster management. This is your chance to find solutions to the
              specific challenges your team is facing right now.
            </li>
            <li>
              <strong>Learning from Leaders:</strong> The speaker list features
              CNCF Ambassadors and senior engineers from top-tier tech
              companies. This is a rare opportunity to learn best practices and
              implementation strategies from the experts who are defining the
              industry.
            </li>
            <li>
              <strong>Networking for Solutions:</strong> The "hallway track" is
              invaluable. You will be in a room with hundreds of other
              engineers, including those from key vendors like AWS and Red Hat,
              all working on the same stack.
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            The Ecosystem: Network with Key Industry Partners
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            The true value of this conference's ecosystem comes from its
            official partners and a unique location. Aarchus is a Danish
            technological epicenter - a buzzing technological hub, home to
            hundreds of companies and startus. The event brings together the
            major global and local players who define the tech industry in the
            Nordics. Attending gives you direct access to global cloud-native
            leaders. Top-tier sponsors include international giants like AWS,
            Red Hat, SUSE, EDB, and Akamai. This is a unique opportunity to talk
            directly with the engineers from the core technology companies we
            rely on.
          </p>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Furthermore, the conference is deeply embedded in the Danish tech
            scene and supported by the community's most significant employers.
            Key partners include major Danish tech firms like Trifork and
            Bankdata, as well as globally recognized regional brands like The
            LEGO Group, Saxo Bank A/S, and JYSK. Attending means networking
            directly with the key tech players in Denmark, all gathered in one
            place.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Getting There: Travel Logistics Made Simple
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Getting to the conference is straightforward, even for international
            attendees.
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 space-y-4">
            <li>
              <strong>Flights:</strong> Flights into Copenhagen (CPH) are
              generally the most affordable international access point.
            </li>
            <li>
              <strong>Train:</strong> From{" "}
              <a
                href="https://www.cph.dk/en"
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                Copenhagen Airport
              </a>
              , there is a direct{" "}
              <a
                href="https://www.dsb.dk/en"
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                DSB
              </a>{" "}
              regional train that connects directly to Aarhus. The journey is
              comfortable and reliable (free Wi-Fi on-board), taking
              approximately 3,5 hours.
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            The Budget: A Full Cost Breakdown
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Below are two example scenarios to use for your budget request,
            based on the conference ticket price and partner hotel rates. These
            assume travel starting from Copenhagen.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="border rounded-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                1 Attendee
              </h3>
              <ul className="text-lg text-gray-700 space-y-2">
                <li>
                  <strong>Conference Ticket:</strong> DKK 2,074.00
                </li>
                <li>
                  <strong>Travel (Train):</strong> ~ DKK 200.00 - 650.00
                </li>
                <li>
                  <strong>Accommodation (2 nights):</strong> ~ DKK 2,390.00
                </li>
                <li>
                  <strong>Per Diem (2 days):</strong> DKK 700.00
                </li>
                <li className="font-bold mt-4">
                  Total: ~ DKK 5,364.00 – 5,814.00
                </li>
              </ul>
            </div>
            <div className="border rounded-lg p-6 text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                2 Attendees
              </h3>
              <ul className="text-lg text-gray-700 space-y-2">
                <li>
                  <strong>Conference Tickets (x2):</strong> DKK 4,148.00
                </li>
                <li>
                  <strong>Travel (Train x2):</strong> ~ DKK 400.00 - 1.300.00
                </li>
                <li>
                  <strong>Accommodation (1 room, 2 nights):</strong> ~ DKK
                  2,790.00
                </li>
                <li>
                  <strong>Per Diems (2 days):</strong> DKK 1,400.00
                </li>
                <li className="font-bold mt-4">
                  Total: ~ DKK 7,478.00 – 8,378.00
                </li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            *These budget estimates rely on booking discounted{" "}
            <a
              href="https://www.dsb.dk/find-produkter-og-services/orange"
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              DSB Orange
            </a>{" "}
            train fares (which require advance booking) and the special
            conference rates at our partner hotels from{" "}
            <a
              href="https://www.scandichotels.com/en"
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              Scandic{" "}
            </a>
            (twin beds for double rooms are subject to availability).
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Your "Get Approval" Email Template
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Copy, paste, and adapt this template. It is designed to be short,
            respectful of your manager's time, and focused purely on value,
            while referencing the detailed budget you have prepared.
          </p>
          <div className="bg-gray-100 rounded-lg p-6 text-left">
            <pre className="whitespace-pre-wrap text-gray-800">
              <code>
                <strong>
                  Subject: Request: Approval for Cloud Native Denmark 2025
                  Conference
                </strong>
                <br />
                <br />
                Hi [Manager's Name],
                <br />
                <br />
                I am writing to request approval and budget to attend the Cloud
                Native Denmark technical conference this October 7-8 in Aarhus.
                This event is the continuation of the successful KCD Denmark
                conference from last year, run by the same community organizers.
                <br />
                <br />
                My primary goal for attending is to focus on solutions for our
                [Name of Project/Initiative, e.g., Kubernetes platform
                optimization]. The conference provides direct access to experts
                and hands-on sessions covering [Specific Challenge 1, e.g.,
                container security] and [Specific Challenge 2, e.g., service
                mesh performance], allowing me to bring back actionable
                strategies we can implement directly.
                <br />
                <br />
                We will also have the opportunity to connect directly with key
                partners like AWS, Red Hat, and EDB, as well as major Danish
                tech employers like Trifork and Bankdata.
                <br />
                <br />
                Upon my return, I will host a tech-debrief for the team to share
                all key takeaways, documentation, and proposals.
                <br />
                <br />
                The total estimated investment is [Insert Total from Scenario 1
                or 2]. I have a full itemized cost breakdown prepared (including
                all travel, per diem, and hotel details) that I can send over.
                <br />
                <br />
                Can we please discuss this next week when you have time?
                <br />
                <br />
                Thank you,
                <br />
                [Your Name]
              </code>
            </pre>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ConvinceYourBossPage;

export const Head: HeadFC = ({ location: { pathname } }) => (
  <SEO
    pathname={pathname}
    title="Convince Your Boss"
    description="Justification and email template to get approval to attend Cloud Native Denmark 2025."
  />
);
