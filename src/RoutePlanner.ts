import ip, { SubnetInfo } from "ip";
import { ROUTEPLANNER_NO_IPS } from "./Constant";
import { RandomIp } from "./RandomIp";
import { ILoggerLike } from "./types/ILoggerLike";

export interface RoutePlannerOptions {
  ipBlocks: string[];
  excludeIps?: string[];
  log?: ILoggerLike;
}

// CIDR = ffff:ffff:ffff::
// subnetInfo.subnetMaskLength = ffff:ffff:ffff::/48
export class IpBlock {
  public usedCount: number;
  public readonly cidr: string;
  public readonly cidrSize: number;
  constructor(blockString: string) {
    this.usedCount = 0;
    this.cidr = ip.cidr(blockString);
    this.cidrSize = ip.cidrSubnet(blockString).subnetMaskLength;
  }
}

export class RoutePlanner {
  private excludeIps: string[] = [];
  private ipBlocks: IpBlock[];
  private failedAddresses: Map<string, number>;
  private log?: ILoggerLike;
  constructor({ ipBlocks, excludeIps, log }: RoutePlannerOptions) {
    this.excludeIps = excludeIps ?? [];
    this.ipBlocks = ipBlocks.map((ip: string) => new IpBlock(ip));
    this.failedAddresses = new Map();
    this.log = log;
  }

  public getIdealIp(): string {
    const idealIpBlock: IpBlock | undefined = this.getSortedBlocks();
    if (!idealIpBlock)
      throw new Error(`${ROUTEPLANNER_NO_IPS} No ip address available`);
    const randomIp: string = RandomIp.getRandomIp(
      idealIpBlock.cidr,
      idealIpBlock.cidrSize
    );
    this.log?.debug(
      `[Routeplanner] Get ideal ip from block ${idealIpBlock?.cidr}/${idealIpBlock?.cidrSize}`
    );
    if (
      this.excludeIps.includes(randomIp) ||
      this.failedAddresses.get(randomIp)
    ) {
      return this.getIdealIp();
    } else {
      this.ipBlocks[this.ipBlocks.findIndex((e) => e.cidr == idealIpBlock.cidr)]
        .usedCount++;
      return randomIp;
    }
  }

  public markIpFailed(ip: string) {
    const failedCount: number = this.failedAddresses.get(ip) ?? 0;
    this.failedAddresses.set(ip, failedCount + 1);
  }

  private getSortedBlocks(): IpBlock | undefined {
    return this.ipBlocks.sort((a, b) => a.usedCount - b.usedCount)[0];
  }
}
