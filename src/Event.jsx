import MessageBoard from "./components/MessageBoard";
import RsvpForm from "./components/RsvpForm";
import { useParams } from "react-router-dom";

function App() {
  const { eventId } = useParams();
  return (
    <div className="flex-col space-y-10">
      <RsvpForm eventId={eventId} />
      <MessageBoard />
    </div>
  );
}

export default App;
