const step = [
    {
        id: 'welcome',
        text: [
            `
        <p>
        Shepherd is a JavaScript library for guiding users through your app.
        It uses <a href="https://popper.js.org/">Popper.js</a>,
        another open source library, to render dialogs for each tour "step".
        </p>
        <p>
        Among many things, Popper makes sure your steps never end up off screen or
        cropped by an overflow. (Try resizing your browser to see what we mean.)
        </p>
        `
        ],
        attachTo: { element: '#step1', on: 'bottom' },
        classes: 'shepherd shepherd-welcome',
        buttons: [
            {
                type: 'cancel',
                classes: 'shepherd-button-secondary',
                text: 'Exit'
            },
            {
                type: 'next',
                text: 'Next'
            }
        ]
    },
    {
        id: 'installation',
        title: 'Installation',
        text:
            'Installation is simple, if you are using npm or yarn, just install like any other package.',
        attachTo: { element: '#step2', on: 'bottom' },
        buttons: [
            {
                type: 'back',
                classes: 'shepherd-button-secondary',
                text: 'Back'
            },
            {
                type: 'next',
                text: 'Next'
            }
        ]
    },
];

export default step