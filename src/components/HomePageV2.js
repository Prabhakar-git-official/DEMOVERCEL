import React from 'react';
import Layout from './Layouts/Layout';
import TUAPotential from './Sections/TuaPotential';
import HomeBanner from './Sections/HomeBannerV2';
import Investement from './Sections/Investement';

function HomePage() {
    return (
        <Layout>
            <div className="page-home-v2">
                <HomeBanner />
                <TUAPotential />
                <Investement />
            </div>
        </Layout>
    );
}

export default HomePage;