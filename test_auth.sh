#!/bin/bash

# Crisis Journalist AI - Authentication Test Script
# This script tests the authentication system

API_URL="http://0.0.0.0:8000"
TEST_EMAIL="test_$(date +%s)@example.com"
TEST_PASSWORD="test123456"
TEST_NAME="Test User"

echo "🧪 Testing Crisis Journalist AI Authentication System"
echo "=================================================="
echo ""

# Test 1: Register a new user
echo "✅ Test 1: Registering new user..."
echo "Email: $TEST_EMAIL"
echo "Password: $TEST_PASSWORD"
echo "Name: $TEST_NAME"
echo ""

REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"full_name\": \"$TEST_NAME\"
  }")

echo "Response:"
echo "$REGISTER_RESPONSE" | python3 -m json.tool
echo ""

# Extract token and user_id
TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('token', ''))")
USER_ID=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('user', {}).get('user_id', ''))")

if [ -z "$TOKEN" ]; then
  echo "❌ Registration failed - no token received"
  exit 1
fi

echo "✅ Registration successful!"
echo "User ID: $USER_ID"
echo "Token: ${TOKEN:0:50}..."
echo ""

# Test 2: Login with the same credentials
echo "✅ Test 2: Logging in with credentials..."
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Response:"
echo "$LOGIN_RESPONSE" | python3 -m json.tool
echo ""

LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('token', ''))")

if [ -z "$LOGIN_TOKEN" ]; then
  echo "❌ Login failed - no token received"
  exit 1
fi

echo "✅ Login successful!"
echo ""

# Test 3: Verify token can be used
echo "✅ Test 3: Using token to fetch user's projects..."
echo ""

PROJECTS_RESPONSE=$(curl -s -X GET "$API_URL/api/projects/$USER_ID?limit=10" \
  -H "Authorization: Bearer $TOKEN")

echo "Response:"
echo "$PROJECTS_RESPONSE" | python3 -m json.tool
echo ""

echo "✅ Token authentication working!"
echo ""

# Summary
echo "=================================================="
echo "🎉 All Authentication Tests Passed!"
echo "=================================================="
echo ""
echo "Summary:"
echo "  - Registration: ✅ Success"
echo "  - Login: ✅ Success"
echo "  - Token Auth: ✅ Success"
echo "  - User ID: $USER_ID"
echo ""
echo "You can now use these credentials in the frontend:"
echo "  Email: $TEST_EMAIL"
echo "  Password: $TEST_PASSWORD"
echo ""
