(function () {
    'use strict';

    var core = angular.module('wdts.commonui.core');
    var config = {};

    config.protocol = '#@webserverProtocol@#';
    config.protocolDevice = config.protocol;
    config.camPort = ':8160';
    config.webserverDNS = '#@webserverUrl@#';
    config.tableUIProtocol = '#@webserverTableUIProtocol@#';
    config.singleTablePort = '#@singleTablePort@#';
    config.authentication_type = '#@authenticationType@#';
    config.webserver = config.protocol + config.webserverDNS;
    config.treasuryPort =':#@webTreasuryTLSPort@#/';
    config.chipSummaryUrl = '/api/cam/v1/chips/?summary=true&transactionDetail=false';
    config.chipSummaryUrlForCam = '/api/cam/v1/chips/?summary=false&transactionDetail=false';
    config.chipDetailUrl = '/api/cam/v1/chips/?summary=false&transactionDetail=false';
    config.chipServiceTotalChipsGetUrl = config.webserver + '/api/chip/v1/chips/?_summary=true';
    config.chipServiceChipCache = config.webserver + '/api/chip/v1/chipCache?topologyId=-1';
    config.camSubscription = '/cam';
    config.chipSummaryTopic = '/topic/chipSummariesCallback';
    config.chipSummaryTopicForCam = '/topic/chipDeltasCallback';
    config.playerPath = config.protocol + config.webserverDNS;
    config.postBuyInPlayerUrl = '/api/cam/v1/transactions/';
    config.postCashOutPlayerUrl = '/api/cam/v1/transactions/';
    config.postUpdateOwnershipUrl = '/api/cam/v1/transactions/';
    config.postEnrollChips = '/api/cam/v1/transactions/';
    config.postChangeChips = '/api/cam/v1/transactions/';
    config.openCONUrl = config.webserver + ':#@webConfigurationTLSPort@#/';
    config.openTreasuryUrl = config.webserver + config.treasuryPort ;
    config.openCMUrl = config.webserver + ':#@webCasinoManagerTLSPort@#/';
    config.openPDUrl = config.webserver + ':#@webPlayerDashboardTLSPort@#/';
    config.openAlertsUrl = config.webserver + ':#@webAlertsTLSPort@#/';
    config.openTDUrl = config.webserver + ':#@webTableDashboardTLSPort@#/';
    config.openCAMUrl = config.webserver + ':#@webCamTLSPort@#/';
    config.openCashierUrl = config.webserver + ':#@webCashierTLSPort@#/';
    config.webDashboardPort = '#@webDashboardTLSPort@#';
    config.ppmasterLoginUrl = config.webserver + ':' + config.webDashboardPort + '/#/ppmaster';
    config.jasperUrl = config.webserver + '/jasperserver-pro';
    config.auth_postApprovalRoute = config.webserver + '/api/auth/v1/approvals';
    config.auth_socketroute = config.webserver + '/api/auth';
    config.auth_route2 = config.webserver + '/api/auth/v1/approvals?topologyIds=';
    config.threshold_limit = config.webserver + '/api/configuration/v1/configurations/?templateTypeCode=SYSTEM&type=TEMPLATE';
    config.topology_topologyNodesInfoUrl = config.webserver + '/api/topology/v1/topologyNodes/host?hostName=';
    config.log = config.webserver+'/log/';
    config.hostCallTopologyUrl = config.webserver + '/api/configuration/v1/configurations/?templateTypeCode=PLAY_CRITERIA&type=CURRENT&topologyId=';
    config.hostCallTopologyPostUrl = config.webserver + '/api/configuration/v1/configurations/?templateTypeCode=PLAY_CRITERIA&type=CURRENT';

    config.app = {
        errorPrefixes: {
            alerts: '[Alerts - App Error] ',
            cam: '[CAM - App Error] ',
            cashier: '[Cashier - App Error] ',
            casinoManager: '[Casino Manager - App Error] ',
            configuration: '[Configuration - App Error] ',
            login: '[Login - App Error] ',
            playerDashboard: '[Player Dashboard - App Error] ',
            tableDashboard: '[Table Dashboard - App Error] ',
            treasury: '[Treasury - App Error] '
        },
        titles: {
            alerts: 'Alerts',
            cam: 'CAM',
            cashier: 'Cashier',
            casinoManager: 'Casino Manager',
            configuration: 'Configuration',
            login: 'Login',
            playerDashboard: 'Player Dashboard',
            tableDashboard: 'Table Dashboard',
            treasury: 'Treasury'
        }
    };

    var nginx = config.webserverDNS;

    config.casino = {};
    config.casino.routes = {
        scheme: config.protocol,
        host: nginx,
        basePath: '/api/casinomanager/v1/topologyStats',
        basePath1: '/api/casinomanager/v1/playerStats/topWinningCasino',
        basePath2: '/api/casinomanager/v1/playerStats/topLosingCasino',
        basePath3: '/api/casinomanager/v1/playerStats/topWinningPlayers',
        basePath4: '/api/casinomanager/v1/playerStats/topLosingPlayers',
        basePath5: '/api/casinomanager/v1/',
        basePath6: '/api/casinomanager/v1/topologyStatistics',
        basePath7: '/api/casinomanager/v1/',
        basePath8: '/api/casinomanager/v1/topologyStatisticsTabularView',
        basePath9: '/api/casinomanager/v1/activePlayer',
        basePath10: '/api/cage/v1/fcTransactions',
        tableGridStatsPath: '/api/casinomanager/v1/topologyStatisticsWithCount?gamingDay=',
        updatePlayer:'/api/casinomanager/v1/updatePlayer',
        cancelUpdateSession:'/api/casinomanager/v1/cancelUpdateSession',
        pitViewFilters:'/api/casinomanager/v1/filter'
    };

    config.casino.route = config.casino.routes.scheme + config.casino.routes.host
        + config.casino.routes.basePath;
    config.casino.route1 = config.casino.routes.scheme + config.casino.routes.host
        + config.casino.routes.basePath1;
    config.casino.route2 = config.casino.routes.scheme + config.casino.routes.host
        + config.casino.routes.basePath2;
    config.casino.route5 = config.casino.routes.scheme + config.casino.routes.host
        + config.casino.routes.basePath5;
    config.casino.route6 = config.casino.routes.scheme + config.casino.routes.host
        + config.casino.routes.basePath6;
    config.casino.route7 = config.casino.routes.scheme + config.casino.routes.host
        + config.casino.routes.basePath7;
    config.casino.route8 = config.casino.routes.scheme + config.casino.routes.host
        + config.casino.routes.basePath8;
    config.casino.route9 = config.casino.routes.scheme + config.casino.routes.host
        + config.casino.routes.basePath9;
    config.casino.route10 = config.casino.routes.scheme + config.casino.routes.host
        + config.casino.routes.basePath10;
    config.casino.tableGridStatsRoute = config.casino.routes.scheme + config.casino.routes.host
        + config.casino.routes.tableGridStatsPath;
    config.casino.updatePlayer = config.casino.routes.scheme + config.casino.routes.host
        +config.casino.routes.updatePlayer;
    config.casino.cancelUpdateSession = config.casino.routes.scheme + config.casino.routes.host
        +config.casino.routes.cancelUpdateSession;
    config.casino.pitViewFilters = config.casino.routes.scheme + config.casino.routes.host
        +config.casino.routes.pitViewFilters;
    config.cage = {};
    config.cage.routes = {
        host: nginx,
        scheme: config.protocol,
        basePath: '/api/cage',
        version: '/v1/',
        path: ''
    };

    config.cage.route = config.cage.routes.scheme + config.cage.routes.host + config.cage.routes.basePath + config.cage.routes.version
        + config.cage.routes.path;

    config.cage.isEnrollprocess = config.cage.route + 'isEnrollprocess';
    config.cage.batchEnroll = config.cage.route + 'batchEnroll';
    config.auth = {};
    config.auth.routes = {
        host: nginx,
        scheme: config.protocol,
        socketAuth: '/api/auth',
        basePath: '/api/auth',
        version: '/v1',
        oauthTokenPath: '/oauth/token',
        oauthAuthorizePath: '/oauth/authorize',
        approvalsPath: '/approvals',
        usersPath: '/users',
        refreshPath: '/refresh',
        logoutPath: '/logout',
        loginPath: '/login',
        topologyArg: '?topologyIds=',
        loginTable: '/api/table/v1/login',
        luckySixInfo: '/api/table/v1/luckySixInfo'
    };


    config.auth.route = config.auth.routes.scheme + config.auth.routes.host + config.auth.routes.basePath;
    config.auth.socketAuth = config.auth.routes.scheme + config.auth.routes.host + config.auth.routes.socketAuth;
    config.auth.oauthRefresh = config.auth.route + config.auth.routes.oauthTokenPath + config.auth.routes.refreshPath;
    config.auth.oauthLogout = config.auth.route + config.auth.routes.oauthTokenPath + config.auth.routes.logoutPath;
    config.auth.oauthLogin = config.auth.route + config.auth.routes.oauthTokenPath + config.auth.routes.loginPath;
    config.auth.oauthAuthorize = config.auth.route + config.auth.routes.oauthAuthorizePath;
    config.auth.users = config.auth.route + config.auth.routes.version + config.auth.routes.usersPath;
    config.auth.approvals = config.auth.route + config.auth.routes.version + config.auth.routes.approvalsPath;
    config.auth.approvalsTopology = config.auth.approvals + config.auth.routes.topologyArg;

    config.configuration = {};
    config.configuration.routes = {
        host: nginx,
        scheme: config.protocol,
        path:'/api/configuration/',
        version: '/v1',
        propertiesPath: '/properties',
        configurationsPath: '/configurations',
        categoriesPath: '/categories'
    };

    config.configuration.route = config.configuration.routes.scheme + config.configuration.routes.host + config.configuration.routes.path;
    config.configuration.properties = config.configuration.route + config.configuration.routes.version + config.configuration.routes.propertiesPath;
    config.configuration.configurations = config.configuration.route + config.configuration.routes.version + config.configuration.routes.configurationsPath;
    config.configuration.categories = config.configuration.route + config.configuration.routes.version + config.configuration.routes.categoriesPath;

    config.user = {};
    config.user.routes = {
        host: nginx,
        scheme: config.protocol,
        basePath: '/api/user',
        version: '/v1',
        usersPath: "/users",
        rolesPath: "/roles",
        permissionsPath: "/permissions",
        applicationsPath: "/applications"
    };

    config.user.route = config.user.routes.scheme + config.user.routes.host + config.user.routes.basePath;
    config.user.users = config.user.route + config.user.routes.version + config.user.routes.usersPath;
    config.user.roles = config.user.route + config.user.routes.version + config.user.routes.rolesPath;
    config.user.permissions = config.user.route + config.user.routes.version + config.user.routes.permissionsPath;
    config.user.applications = config.user.route + config.user.routes.version + config.user.routes.applicationsPath;

    config.alert = {};
    config.alert.routes = {
        host: nginx,
        scheme: config.protocol,
        socketAlert: '/alert',
        basePath: '/api/alert',
        version: '/v1',
        alertsPath: '/alerts',
        alertCountsPath: '/alertCounts',
        alertConfigurationPath: '/alertConfiguration',
        metricsPath: '/metrics',
        topologyArg: '?topologyId=',
        filter: "/filters"
    };

    config.alert.route = config.alert.routes.scheme + config.alert.routes.host + config.alert.routes.basePath;
    config.alert.socketAlert = config.alert.routes.scheme + config.alert.routes.host + config.alert.routes.socketAlert;
    config.alert.alerts = config.alert.route + config.alert.routes.version + config.alert.routes.alertsPath;
    config.alert.alertsTopology = config.alert.alerts + config.alert.routes.topologyArg;
    config.alert.alertCounts = config.alert.route + config.alert.routes.version + config.alert.routes.alertCountsPath;
    config.alert.alertConfiguration = config.alert.route + config.alert.routes.version + config.alert.routes.alertConfigurationPath;
    config.alert.metrics = config.alert.route + config.alert.routes.version + config.alert.routes.metricsPath;
    config.alert.filters = config.alert.route + config.alert.routes.version + config.alert.routes.filter

    config.chip = {};
    config.chip.routes = {
        host: nginx,
        scheme: config.protocol,
        basePath: '/api/chip',
        version: '/v1',
        chipsPath: '/chips',
        chipsetsPath: '/chipsets',
        chipsetConfigPath: '/configurationChipsets',
        companyPath: '/company',
        transactionsPath: '/transactions',
        bankrollsPath: '/bankrolls',
        currencyPath: '/currency'
    };

    config.chip.route = config.chip.routes.scheme + config.chip.routes.host + config.chip.routes.basePath;
    config.chip.chips = config.chip.route + config.chip.routes.version + config.chip.routes.chipsPath;
    config.chip.chipsets = config.chip.route + config.chip.routes.version + config.chip.routes.chipsetsPath;
    config.chip.chipsetsConfig = config.chip.route + config.chip.routes.version + config.chip.routes.chipsetsPath + config.chip.routes.chipsetConfigPath;
    config.chip.company = config.chip.route + config.chip.routes.version + config.chip.routes.companyPath;
    config.chip.transactions = config.chip.route + config.chip.routes.version + config.chip.routes.transactionsPath;
    config.chip.bankrolls = config.chip.route + config.chip.routes.version + config.chip.routes.bankrollsPath;
    config.chip.currency = config.chip.route + config.chip.routes.version + config.chip.routes.currencyPath;

    config.topologyNodes = {};
    config.topologyNodes.routes = {
        host: nginx,
        scheme: config.protocol,
        basePath: '/api/topology',
        version: '/v1/',
        topologyPath: 'topologyNodes/',
        unassignedPath: 'unassignedNodes',
        tGroupDescPath: 'topologyGroups/'
    };

    config.topologyNodes.route = config.topologyNodes.routes.scheme + config.topologyNodes.routes.host
        + config.topologyNodes.routes.basePath + config.topologyNodes.routes.version
        + config.topologyNodes.routes.topologyPath;

    config.topologyNodes.unassignedroute = config.topologyNodes.routes.scheme + config.topologyNodes.routes.host
        + config.topologyNodes.routes.basePath + config.topologyNodes.routes.version
        + config.topologyNodes.routes.unassignedPath;

    config.topologyNodes.tgroupdescnroute = config.topologyNodes.routes.scheme + config.topologyNodes.routes.host
        + config.topologyNodes.routes.basePath + config.topologyNodes.routes.version
        + config.topologyNodes.routes.tGroupDescPath;


    config.topologyGroups = {};
    config.topologyGroups.route = config.topologyNodes.routes.scheme + config.topologyNodes.routes.host;

    config.topologyTypes = {};
    config.topologyTypes.routes = {
        host: nginx,
        scheme: config.protocol,
        basePath: '/api/topology',
        version: '/v1/',
        path: 'topologyTypes/'
    };

    config.topologyTypes.route = config.topologyTypes.routes.scheme + config.topologyTypes.routes.host
        + config.topologyTypes.routes.basePath + config.topologyTypes.routes.version
        + config.topologyTypes.routes.path;

    config.topologyRelationships = {};
    config.topologyRelationships.routes = {
        host: nginx,
        basePath: '/api/topology',
        version: '/v1/',
        scheme: config.protocol,
        path: 'topologyRelationships/'
    };

    config.topologyRelationships.route = config.topologyRelationships.routes.scheme
        + config.topologyRelationships.routes.host
        + config.topologyRelationships.routes.basePath
        + config.topologyRelationships.routes.version
        + config.topologyRelationships.routes.path;

    config.devices = {};
    config.devices.routes = {
        host: nginx,
        scheme: config.protocol,
        basePath: '/api/device',
        version: '/v1/',
        path: 'devices/'
    };

    config.devices.route = config.devices.routes.scheme + config.devices.routes.host
        + config.devices.routes.basePath + config.devices.routes.version
        + config.devices.routes.path;

    config.game = {};
    config.game.routes = {
        host: nginx,
        scheme: config.protocol,
        basePath: '/api/casinomanager/v1/',
        socketBuyIn: '/buyInAutoRefresh',
        socketEog: '/eogRefresh',
        socketEogScan: '/eogScanRefresh'
    };
    config.game.route = config.game.routes.scheme + config.game.routes.host
        + config.game.routes.basePath;
    config.game.socketBuyIn = config.game.routes.scheme + config.game.routes.host + config.game.routes.socketBuyIn;
    config.game.socketEog = config.game.routes.scheme + config.game.routes.host + config.game.routes.socketEog;
    config.game.socketEogScan = config.game.routes.scheme + config.game.routes.host + config.game.routes.socketEogScan;





    config.player = {};
    config.player.routes = {
        host: nginx,
        scheme: config.protocol,
        basePath: '/api/player',
        version: '/v1/',
        path:'players/'
    };
    config.player.route = config.player.routes.scheme + config.player.routes.host + config.player.routes.basePath + config.player.routes.version+ config.player.routes.path;

    config.configration = {};
    config.configration.routes = {
        host: nginx,
        scheme: config.protocol,
        basePath: '/api/configuration/v1/configurations/'
    };

    config.configration.route = config.configration.routes.scheme + config.configration.routes.host
        + config.configration.routes.basePath;

    config.print = {};
    config.print.routes = {
        host: nginx,
        scheme: config.protocol,
        basePath: '/api/print',
        version: '/v1/'
    };

    config.print.route = config.print.routes.scheme + config.print.routes.host + config.print.routes.basePath + config.print.routes.version;

    config.bonus = {};
    config.bonus.routes = {
        scheme: config.protocol,
        host: nginx,
        templatePath: '/api/bonus/v1/bonusPrograms/?status=TEMPLATE',
        bonusProgramsPath: '/api/bonus/v1/bonusPrograms',
        bonusAwardsPath: '/api/bonus/v1/bonusAward',
        bonusAwardReportDataPath: '/api/bonus/v1/bonusAwardReportData',
    };

    config.bonus.templateRoute = config.bonus.routes.scheme + config.bonus.routes.host
        + config.bonus.routes.templatePath;
    config.bonus.bonusProgramsRoute = config.bonus.routes.scheme + config.bonus.routes.host
        + config.bonus.routes.bonusProgramsPath;
    config.bonus.bonusAwardsRoute = config.bonus.routes.scheme + config.bonus.routes.host
        + config.bonus.routes.bonusAwardsPath;
    config.bonus.bonusAwardReportDataRoute = config.bonus.routes.scheme + config.bonus.routes.host
        + config.bonus.routes.bonusAwardReportDataPath;


    config.promotion = {};
    config.promotion.routes = {
        scheme: config.protocol,
        host: nginx,
        winners: '/api/promotion/v1/winners',
        managePromotion: '/api/promotion/v1/promotion-management-enabled/status',
    };

    config.promotion.winners = config.bonus.routes.scheme + config.bonus.routes.host + config.promotion.routes.winners;
    config.promotion.managePromotion = config.bonus.routes.scheme + config.bonus.routes.host + config.promotion.routes.managePromotion;

    core.constant('config', config);
})();
