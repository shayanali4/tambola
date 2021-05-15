/**
 * App Config File
 */
const AppConfig = {
    appLogo: require('Assets/img/site-logo.jpg'),          // App Logo
    appUrl: 'http://reactify.theironnetwork.org',             // App Url
    brandName: 'Tambola',                          // Brand Name
    brandUrl: 'http://www.sslcouponcodes.com',
    navCollapsed: false,                                      // Sidebar collapse
    darkMode: false,                                          // Dark Mode
    lightMode: false,                                          // Dark Mode
    boxLayout: true,                                         // Box Layout
    rtlLayout: false,                                         // RTL Layout
    miniSidebar: false,                                       // Mini Sidebar
    enableSidebarBackgroundImage: false,                       // Enable Sidebar Background Image
    locale: {
        languageId: 'english',
        locale: 'en',
        name: 'English',
        icon: 'en',
    },
    enableUserTour: false,                                      // Enable / Disable User Tour
    copyRightText: ' © '+ new Date().getFullYear()  + ' All Rights Reserved.',      // Copy Right Text
    // light theme colors
    themeColors: {
        'primary': '#2e8de1',
        'secondary': '#6a6b6b',
        'success': '#39c694',
        'danger': '#ee316b',
        'warning': '#f9c929',
        'info': '#00D0BD',
        'dark': '#464D69',
        'default': '#FAFAFA',
        'greyLighten': '#A5A7B2',
        'grey': '#6a6b6b',
        'white': '#FFFFFF',
        'purple': '#896BD6',
        'yellow': '#D46B08'
    },
    // dark theme colors
    darkThemeColors: {
        darkBgColor: '#424242'
    }
}

export default AppConfig;
