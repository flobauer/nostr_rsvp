import { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "helpers/util";

function DropDown({ events, setNostrOpen }) {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left ml-auto font-mono">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 px-3 py-2 font-semibold text-gray-900 ">
          Event Settings
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 flex flex-col">
            <Menu.Item>
              {({ active }) => (
                <Link
                  to={`/`}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 border-b"
                  )}>
                  Create Event
                </Link>
              )}
            </Menu.Item>
            {events.map((event) => (
              <Menu.Item key={event.id}>
                {({ active }) => (
                  <Link
                    to={`/${event.id}`}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2"
                    )}>
                    🗓️ {JSON.parse(event.content).name}
                  </Link>
                )}
              </Menu.Item>
            ))}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setNostrOpen(true)}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block text-left px-4 py-2 border-t"
                  )}>
                  Nostr Settings
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

DropDown.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      start: PropTypes.object,
      location: PropTypes.string,
    })
  ).isRequired,
  setNostrOpen: PropTypes.func,
};

export default DropDown;
