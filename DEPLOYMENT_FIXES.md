# Deployment Fixes

## MongoDB Rentals StatefulSet Fix

**Date**: 2025-09-22  
**Issue**: The `mongodb-rentals` StatefulSet was failing with ImagePullBackOff error trying to pull the deprecated Bitnami MongoDB image `docker.io/bitnami/mongodb:4.0.12-debian-9-r43`

**Root Cause**: The dependency repository `movies-rentals` was still using the old Bitnami MongoDB image which is no longer available.

**Resolution Applied**:
1. Updated StatefulSet `mongodb-rentals` to use official MongoDB 7.0 image
2. Updated environment variables from Bitnami format to official MongoDB format:
   - `MONGODB_*` → `MONGO_INITDB_*` 
3. Changed volume mount path from `/bitnami/mongodb` to `/data/db`
4. Updated init containers to use correct image and paths

**Commands Executed**:
```bash
# Patched StatefulSet with correct image and environment variables
kubectl patch statefulset mongodb-rentals -n ${OKTETO_NAMESPACE} --type='json' -p='[...]'

# Recreated StatefulSet with updated configuration  
kubectl delete statefulset mongodb-rentals -n ${OKTETO_NAMESPACE} --cascade=orphan
kubectl apply -f /tmp/mongodb-rentals-sts.yaml -n ${OKTETO_NAMESPACE}

# Restarted pod with new configuration
kubectl delete pod mongodb-rentals-0 -n ${OKTETO_NAMESPACE}
```

**Verification**:
- ✅ mongodb-rentals-0 pod now Running 
- ✅ Using official mongo:7.0 image
- ✅ All application endpoints working correctly
- ✅ No more ImagePullBackOff errors

**Impact**: All MongoDB instances in the application stack now use official Docker images instead of deprecated Bitnami images.