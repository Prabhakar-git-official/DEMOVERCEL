import React from 'react';
import Layout from './Layouts/LayoutLanding';
import ElementBanner from './Sections/ElementBanner';
import ElementProtocol from './Sections/ElementProtocol';
import ElementRoadMap from './Sections/ElementRoadMap';

function Element() {
    return (
        <div className="page-home-element">
            <Layout>
                <ElementBanner />
                <ElementProtocol />
                <ElementRoadMap />
            </Layout>
        </div>
    );
}

export default Element;