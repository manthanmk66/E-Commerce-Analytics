import logo from "./logo.svg";
import "./App.css";
import HeroSection from "./coponents/TransactionsTable";
import TransactionsStatistics from "./coponents/TransactionsStatistics";
import TransactionsBarChart from "./coponents/TransactionsBarChart";

function App() {
  return (
    <div className="App">
      <HeroSection />
      {/* 
      <TransactionsStatistics />
      <TransactionsBarChart /> */}
    </div>
  );
}

export default App;
