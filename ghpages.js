const ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/matyas-mihalyi/mb-tester.git', // Update to point to your repository  
        user: {
            name: 'Matyas Mihalyi', // update to use your name
            email: 'mihalyi.istvan.m@outlook.hu' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)