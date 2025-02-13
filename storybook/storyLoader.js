function loadStories() {
    require('../src/components/General/__stories__/AmountText.stories');
    require('../src/components/General/__stories__/Avatar.stories');
    require('../src/components/General/__stories__/Badge.stories');
    require('../src/components/General/__stories__/InfoMessage.stories');
    require('../src/components/General/__stories__/SegmentButton.stories');
    require('../src/components/Modules/__stories__/RecipientElement.stories');
    require('../src/components/Modules/__stories__/XAppList.stories');
}

const stories = [
    '../src/components/General/__stories__/AmountText.stories',
    '../src/components/General/__stories__/Avatar.stories',
    '../src/components/General/__stories__/Badge.stories',
    '../src/components/General/__stories__/InfoMessage.stories',
    '../src/components/General/__stories__/SegmentButton.stories',
    '../src/components/Modules/__stories__/RecipientElement.stories',
    '../src/components/Modules/__stories__/XAppList.stories',
];

module.exports = {
    loadStories,
    stories,
};
