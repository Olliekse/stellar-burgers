#!/bin/bash
find src -name "*.tsx" -type f -exec sed -i "" "s/from \"..\/..\/slices\/ingredients-slice\"/from \"..\/..\/slices\/stellarBurgerSlice\"/g" {} \;
find src -name "*.tsx" -type f -exec sed -i "" "s/from \"..\/..\/slices\/auth-slice\"/from \"..\/..\/slices\/stellarBurgerSlice\"/g" {} \;
find src -name "*.tsx" -type f -exec sed -i "" "s/from \"..\/..\/slices\/feed-slice\"/from \"..\/..\/slices\/stellarBurgerSlice\"/g" {} \;
find src -name "*.tsx" -type f -exec sed -i "" "s/from \"..\/..\/slices\/user-orders-slice\"/from \"..\/..\/slices\/stellarBurgerSlice\"/g" {} \;
find src -name "*.tsx" -type f -exec sed -i "" "s/useSelector/useAppSelector/g" {} \;
find src -name "*.tsx" -type f -exec sed -i "" "s/useDispatch/useAppDispatch/g" {} \;
find src -name "*.tsx" -type f -exec sed -i "" "s/state\.ingredients/state\.stellarBurger\.ingredients/g" {} \;
find src -name "*.tsx" -type f -exec sed -i "" "s/state\.auth/state\.stellarBurger/g" {} \;
find src -name "*.tsx" -type f -exec sed -i "" "s/state\.feed/state\.stellarBurger/g" {} \;
find src -name "*.tsx" -type f -exec sed -i "" "s/state\.userOrders/state\.stellarBurger\.userOrders/g" {} \;
find src -name "*.tsx" -type f -exec sed -i "" "s/fetchFeeds/fetchFeed/g" {} \;
