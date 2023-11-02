import MessageBoard from "./components/MessageBoard";
import RsvpForm from "./components/RsvpForm";

function App() {
  return (
      <div className="flex-col space-y-10">
      <RsvpForm />
      <MessageBoard />
    </div>
  );
}

export default App;
