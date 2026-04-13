import UserRequestsChart from '../../UserRequestsChart';
import TopScoresBarChart from '../../TopScoresChart';

function Dashboard1() {

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="h-96 w-full">
                <UserRequestsChart />
            </div>
            <div className="h-96 w-full">
                <TopScoresBarChart />
            </div>
        </div>);
}

export default Dashboard1;