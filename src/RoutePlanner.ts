import ip, { SubnetInfo } from "ip";
import { ROUTEPLANNER_NO_IPS } from "./Constant";
import { RandomIp } from "./RandomIp";
import { ILoggerLike } from "./types/ILoggerLike";

export interface RoutePlannerOptions {
  ipBlocks: string[];
  excludeIps?: string[];
  log?: ILoggerLike;
}

export class IpBlock {
  public usedCount: number;
  public failedCount: number;
  public readonly cidr: string;
  public readonly subnetInfo: SubnetInfo;
  constructor(cidr: string) {
    this.usedCount = 0;
    this.failedCount = 0;
    this.cidr = cidr;
    this.subnetInfo = ip.cidrSubnet(cidr);
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
      idealIpBlock.subnetInfo.networkAddress,
      idealIpBlock.subnetInfo.subnetMaskLength
    );
    if (
      this.excludeIps.includes(randomIp) ||
      this.failedAddresses.get(randomIp)
    ) {
      return this.getIdealIp();
    } else {
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
