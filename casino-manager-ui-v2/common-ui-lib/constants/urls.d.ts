import { UrlAlertConstantsInterface } from './url-alert.constants';
import { UrlAuthenticationInterface } from './url-authentication.constants';
import { UrlUserConstantsInterface } from './url-user.constants';
import { UrlConfigurationConstantsInterface } from './url-configuration.constants';
import { UrlChipSetConstantsInterface } from './url-chipset.constants';
import { UrlRolesConstantsInterface } from './url-roles.constants';
import { UrlTopologyConstantsInterface } from './url-topology.constants';
import { UrlCageConstantsInterface } from './url-cage.constants';
import { UrlTopologyTreeConstantsInterface } from './url-topologytree.constants';
import { UrlPromotionConstantsInterface } from './url-promotion.constants';
import { UrlCasinoConstantsInterface } from './url-casinomanager.constants';
import { UrlGameInterface } from './url-game.constants';
import { UrlDeviceConstantsInterface } from './url-device.constants';
import { UrlPlayersInterface } from './url-players.constant';
import { UrlTableConstantsInterface } from './url-table.constants';
export interface URLInterface {
    alert: UrlAlertConstantsInterface;
    auth: UrlAuthenticationInterface;
    user: UrlUserConstantsInterface;
    config: UrlConfigurationConstantsInterface;
    chipSet: UrlChipSetConstantsInterface;
    roles: UrlRolesConstantsInterface;
    topology: UrlTopologyConstantsInterface;
    cage: UrlCageConstantsInterface;
    topologyTree: UrlTopologyTreeConstantsInterface;
    promotion: UrlPromotionConstantsInterface;
    casinoMgr: UrlCasinoConstantsInterface;
    game: UrlGameInterface;
    device: UrlDeviceConstantsInterface;
    player: UrlPlayersInterface;
    table: UrlTableConstantsInterface;
}
export declare const urls: URLInterface;