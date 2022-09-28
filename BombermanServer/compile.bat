@echo off
echo [92mStarting process... [0m
cd C:\Users\Steve\Desktop\Projekte\JavaScript\WeiseSchokolade.github.io\BombermanServer
echo [90mBuilding jar [0m
call mvn package
echo [90mBuilt jar [0m
cd target
echo [90mRenaming jar [0m
copy BombermanServer-0.0.1-SNAPSHOT-jar-with-dependencies.jar BombermanServer.jar
echo [90mCopying jar to Desktop [0m
copy BombermanServer.jar C:\Users\Steve\Desktop
cd ..
echo [92mProcess complete! [0m
timeout /t -1