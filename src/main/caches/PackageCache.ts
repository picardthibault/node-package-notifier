import { MemoryCache, caching } from 'cache-manager';
import { PackageDetails } from '@type/PackageInfo';

export class PackageCache {
  private static instance?: PackageCache;

  static get(): PackageCache {
    if (PackageCache.instance === undefined) {
      PackageCache.instance = new PackageCache();
    }
    return PackageCache.instance;
  }

  // TTL = 1hour
  private readonly cacheTtl = 3600 * 1000;
  private readonly registryCache = new Map<string, MemoryCache>();

  private async createCache(): Promise<MemoryCache> {
    return caching('memory', {
      ttl: this.cacheTtl,
      max: 1000,
    });
  }

  public async get(
    registryUrl: string,
    packageName: string,
  ): Promise<PackageDetails | undefined> {
    const cache = this.registryCache.get(registryUrl);
    return cache ? cache.get(packageName) : undefined;
  }

  public async set(
    registryUrl: string,
    packageName: string,
    packageInfo: PackageDetails,
  ) {
    const cache = this.registryCache.get(registryUrl);
    if (cache) {
      await cache.set(packageName, packageInfo);
    } else {
      const cache = await this.createCache();
      await cache.set(packageName, packageInfo);
      this.registryCache.set(registryUrl, cache);
    }
  }
}
