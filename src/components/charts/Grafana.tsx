import React from 'react';

//configuration file that has the values stored for users

class SampleDashboard extends React.Component {
    render() {
        //suppose user is received from props
        return (
            <>
                {/** different dashboards for different organizations
                 * depending upon the parameters their panels value changes
                 */}
                <iframe
                    src={
                        'http://localhost:3000/d/U03GdePGz/gfndemo?orgId=1&from=1613697435047&to=1613719035047&viewPanel=2'
                    }
                    width={'900'}
                    height={'900'}
                ></iframe>
            </>
        );
    }
}
export default SampleDashboard;
