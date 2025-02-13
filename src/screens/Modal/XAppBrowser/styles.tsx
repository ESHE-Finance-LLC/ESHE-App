import { Platform } from 'react-native';

import { AppSizes } from '@theme';
import StyleService from '@services/StyleService';

/* Styles ==================================================================== */
const styles = StyleService.create({
    container: { flex: 1 },
    webViewContainer: {
        flex: 1,
        backgroundColor: '$background',
    },
    webView: {
        backgroundColor: '$background',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: AppSizes.paddingSml,
    },
    loadingStyle: {
        backgroundColor: '$background',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: '$background',
        paddingTop: Platform.OS === 'ios' ? AppSizes.statusBarHeight + 5 : 10,
        paddingBottom: 10,
    },
    headerTitle: {
        flex: 1,
        paddingLeft: AppSizes.paddingSml,
        paddingRight: AppSizes.paddingSml,
        justifyContent: 'center',
    },
    headerButton: {
        alignItems: 'flex-end',
        paddingRight: AppSizes.paddingSml,
        justifyContent: 'center',
    },
});

export default styles;
