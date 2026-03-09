import './Banners.css';
import StatsOverview from './StatsOverview';
import TopPerformers from './TopPerformers';
export default function Banners() {

    const topSites = [
        { name: 'Top Player in League', url: 'https://google.com', color: '#4285F4' },
        { name: 'Most 100 Player in League', url: 'https://github.com/', color: '#333' },
        { name: 'Most Match Wining', url: 'https://developer.mozilla.org', color: '#000' },
        { name: 'Recent Scores', url: 'https://react.dev', color: '#61DAFB' },
        { name: 'Mostly Viewed Content', url: 'https://youtube.com', color: '#FF0000' },
        { name: 'Most Match Wining', url: 'https://developer.mozilla.org', color: '#000' }
    ];

    return (
            <div>
            <StatsOverview/>
            <TopPerformers/>
            </div>
    );
}