import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
