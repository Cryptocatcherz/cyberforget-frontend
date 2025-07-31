// utils/generateScreenshotUrls.js

const generateScreenshotUrls = (firstName, lastName) => {
    return [
      {
        url: `https://dataveria.com/profile/search?fname=${firstName}&lname=${lastName}`,
        siteName: 'Dataveria',
      },
      {
        url: `https://411.info/people?fn=${firstName}&ln=${lastName}`,
        siteName: '411.info',
      },
      {
        url: `https://www.anywho.com/people/${firstName}%20+${lastName}/`,
        siteName: 'AnyWho',
      },
      
      {
        url: `https://arrestfacts.com/ng/search?fname=${firstName}&lname=${lastName}&state=&city=`,
        siteName: 'ArrestFacts',
      },
      {
        url: `https://clubset.com/profile/search?fname=${firstName}&lname=${lastName}&state=&city=&fage=None`,
        siteName: 'Clubset',
      },
      {
        url: `https://clustrmaps.com/persons/${firstName}-${lastName}`,
        siteName: 'ClustrMaps',
      },
      {
        url: `https://www.corporationwiki.com/search/results?term=${firstName}%20${lastName}`,
        siteName: 'Corporation Wiki',
      },
      {
        url: `https://fastpeoplesearch.io/search?first_name=${firstName}&last_name=${lastName}&state=`,
        siteName: 'FastPeopleSearch.io',
      },
      {
        url: `https://freepeopledirectory.com/name/${firstName}-${lastName}/`,
        siteName: 'FreePeopleDirectory',
      },
      {
        url: `https://neighbor.report/${firstName}-${lastName}`,
        siteName: 'Neighbor Report',
      },
      {
        url: `https://www.peekyou.com/${firstName}_${lastName}`,
        siteName: 'PeekYou',
      },
    ];
  };
  
  export default generateScreenshotUrls;
  