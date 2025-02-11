import { createCache } from 'cache-manager';
import Keyv from 'keyv';
import { PackageDetails } from '@type/PackageInfo';

interface CacheStore {
  get: (packageName: string) => Promise<PackageDetails | null>;
  set: (
    packageName: string,
    PackageDetails: PackageDetails,
  ) => Promise<PackageDetails>;
}

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
  private readonly registryCache = new Map<string, CacheStore>();

  private createCache(): CacheStore {
    return createCache({
      stores: [new Keyv(undefined, { ttl: this.cacheTtl })],
    });
  }

  public async get(
    registryUrl: string,
    packageName: string,
  ): Promise<PackageDetails | undefined> {
    const cache = this.registryCache.get(registryUrl);
    if (!cache) {
      return undefined;
    }
    const cachedValue = await cache.get(packageName);
    return cachedValue ?? undefined;
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
      const cache = this.createCache();
      await cache.set(packageName, packageInfo);
      this.registryCache.set(registryUrl, cache);
    }
  }
}
