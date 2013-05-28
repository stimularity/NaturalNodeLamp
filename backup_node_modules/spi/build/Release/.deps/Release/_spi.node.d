cmd_Release/_spi.node := ln -f "Release/obj.target/_spi.node" "Release/_spi.node" 2>/dev/null || (rm -rf "Release/_spi.node" && cp -af "Release/obj.target/_spi.node" "Release/_spi.node")
