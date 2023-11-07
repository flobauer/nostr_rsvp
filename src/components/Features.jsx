import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";

const features = [
  {
    name: "Free to use.",
    description:
      "The tool is free to use. You can create as many events as you want, and invite as many people as you want.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "No Registration Required.",
    description:
      "You don't need to register, just create an event and share the link with your friends. They can then confirm and see who is coming and who is not.",
    icon: LockClosedIcon,
  },
  {
    name: "Decentralized & Secure.",
    description:
      "RSVPlease is built on the nostr protocol. This means that your data is stored on a cryptographic and cencorship resistant network. Organizing a birthday party never felt better!",
    icon: ServerIcon,
  },
];

export default function Example() {
  return (
    <div className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
          <div className="px-6 lg:px-0 lg:pr-4 lg:pt-4">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-gray-800">
                Event Registration Planning
              </h2>
              <p className="mt-2 text-3xl font-bold font-serif tracking-tight text-sky-700 sm:text-4xl">
                Know who's in.
              </p>
              <p className="mt-6 text-lg leading-6 text-gray-700">
                Nowadays, it is tough to plan an event. You never know who will
                come or not. With RSVPlease, you can easily create an event and
                share it with your friends. They can accept or decline and you
                can track who is coming.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-700 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        className="absolute left-1 top-1 h-5 w-5 text-sky-600"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="sm:px-6 lg:px-0">
            <div className="relative isolate overflow-hidden bg-amber-500 px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pl-16 sm:pr-0 sm:pt-16 lg:mx-0 lg:max-w-none">
              <div
                className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white"
                aria-hidden="true"
              />
              <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                <img
                  src="/screenshot.jpg"
                  alt="Product screenshot"
                  width={2432}
                  height={1442}
                  className="-mb-12 w-[57rem] max-w-none rounded-tl-xl bg-gray-800 ring-1 ring-white/10"
                />
              </div>
              <div
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
