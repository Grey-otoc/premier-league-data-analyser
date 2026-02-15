import './Banners.css';
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
        <div className="top-sites-grid">
            {topSites.map((site, index) => (
                <a key={index} href={site.url} className="site-card" target="_blank" rel="noreferrer">
                    <div className="site-icon-wrapper">
                        {/* Using a favicon service or site.image if you have it */}
                        <img
                            src={`https://placehold.co/200`}
                            alt={site.name}
                            className="site-image-placeholder"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com'; }}
                        />
                    </div>
                    <div className="site-info">
                        <span className="site-name">{site.name}</span>
                    </div>
                </a>
            ))}
        </div>
    );
}