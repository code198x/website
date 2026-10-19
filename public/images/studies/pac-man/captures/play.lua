local n=0
local ports=manager.machine.ioport.ports
local function set(port,name,value) ports[port].fields[name]:set_value(value) end
emu.register_frame_done(function()
 n=n+1
 if n==600 then set(':IN0','Coin 1',1) end
 if n==606 then set(':IN0','Coin 1',0) end
 if n==660 then set(':IN1','1 Player Start',1) end
 if n==666 then set(':IN1','1 Player Start',0) end
 if n==960 then set(':IN0','P1 Left',1) end
 if n==1040 then set(':IN0','P1 Left',0);set(':IN0','P1 Up',1) end
 if n==1160 then set(':IN0','P1 Up',0) end
 if n==900 or n==1000 or n==1060 or n==1120 or n==1200 then
  local err=manager.machine.screens[':screen']:snapshot('play-'..n..'.png');if err then error(tostring(err)) end
 end
 if n==1250 then manager.machine:exit() end
end,'frame')
