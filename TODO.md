# FundVision Production-Ready Fixes - TODO

## Status: In Progress

### 1. ✅ Backend: Async User History Logging (stocks/views.py)
   - ✅ Created Celery task `log_user_history_task`
   - ✅ Updated `StockViewSet.retrieve()` to call task.delay() async (cache hit/miss, minimal DB)
   - ✅ Removed sync `_log_user_history`
   - ✅ Verified: Runs async even from cache

### 2. ✅ Backend: Robust Error Handling (market/tasks.py)
   - ✅ Added `_fetch_from_alpha_vantage` (GLOBAL_QUOTE, key validation, 429 retry)
   - ✅ Updated sync tasks to priority: Alpha > Groww > Yahoo
   - ✅ Fixed Groww index URL/parsing + 429 handling
   - ✅ Enhanced Yahoo/Groww with rate limit raise (Celery retries) & validation

### 3. ✅ Config: .env.example
   - ✅ Created with DEBUG, SECRET_KEY, DB_*, REDIS_*, ALPHA_VANTAGE_API_KEY, CORS etc.

### 4. ✅ Deployment: docker-compose.yml
   - ✅ Full stack: django(gunicorn), mysql8, redis, celery+beat
   - ✅ Healthchecks, env_file, ports, volumes, depends_on

### 5. [ ] ✅ Verify Existing (No Changes)
   - UserHistory: db_index=True ✅
   - Frontend auth interceptor & listener ✅
   - settings.py: CONN_MAX_AGE & CORS ✅

### 6. [ ] Follow-up
   - `python manage.py makemigrations && migrate` (backend)
   - `docker-compose up -d`
   - Test async logging: View stock → check celery worker logs
   - Add ALPHA_VANTAGE_API_KEY & test market sync

**Next: Edit stocks/views.py**
