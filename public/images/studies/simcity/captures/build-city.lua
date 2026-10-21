local p=manager.machine.ioport.ports
p[':input'].fields['Game Port 0 Device'].user_value=0
local n=0
emu.register_frame_done(function()
 n=n+1
 local x,y=0,0
 do local t=math.max(0,math.min(1,(n-3000)/20));x=x+586*t;y=y+115*t end
 do local t=math.max(0,math.min(1,(n-4100)/20));x=x+-450*t;y=y+25*t end
 do local t=math.max(0,math.min(1,(n-8600)/20));x=x+70*t;y=y+104*t end
 do local t=math.max(0,math.min(1,(n-12120)/20));x=x+-66*t;y=y+66*t end
 do local t=math.max(0,math.min(1,(n-13300)/20));x=x+426*t;y=y+-186*t end
 do local t=math.max(0,math.min(1,(n-13500)/20));x=x+50*t;y=y+40*t end
 do local t=math.max(0,math.min(1,(n-13550)/20));x=x+-510*t;y=y+-74*t end
 do local t=math.max(0,math.min(1,(n-13600)/20));x=x+460*t;y=y+114*t end
 do local t=math.max(0,math.min(1,(n-13650)/20));x=x+-410*t;y=y+-114*t end
 do local t=math.max(0,math.min(1,(n-13700)/20));x=x+460*t;y=y+114*t end
 do local t=math.max(0,math.min(1,(n-13750)/20));x=x+-410*t;y=y+-114*t end
 do local t=math.max(0,math.min(1,(n-13800)/20));x=x+360*t;y=y+194*t end
 do local t=math.max(0,math.min(1,(n-13900)/20));x=x+-240*t;y=y+-80*t end
 do local t=math.max(0,math.min(1,(n-13950)/20));x=x+-280*t;y=y+-84*t end
 do local t=math.max(0,math.min(1,(n-14300)/20));x=x+570*t;y=y+-36*t end
 do local t=math.max(0,math.min(1,(n-14400)/20));x=x+-500*t;y=y+-24*t end
 do local t=math.max(0,math.min(1,(n-14450)/50));x=x+100*t;y=y+0*t end
 do local t=math.max(0,math.min(1,(n-17100)/20));x=x+50*t;y=y+304*t end
 do local t=math.max(0,math.min(1,(n-17450)/20));x=x+350*t;y=y+0*t end
 p[':p1_mouse_x'].fields['Mouse X']:set_value(math.floor(x)%256)
 p[':p1_mouse_y'].fields['Mouse Y']:set_value(math.floor(y)%256)
 p[':cia_0_port_a'].fields['P1 Button 1']:set_value(((n>=3030 and n<3035) or (n>=3040 and n<3045) or (n>=4140 and n<4145) or (n>=4160 and n<4165) or (n>=8640 and n<8645) or (n>=12160 and n<12165) or (n>=13340 and n<13345) or (n>=13530 and n<13535) or (n>=13580 and n<13585) or (n>=13630 and n<13635) or (n>=13680 and n<13685) or (n>=13730 and n<13735) or (n>=13780 and n<13785) or (n>=13830 and n<13835) or (n>=13930 and n<13935) or (n>=13980 and n<13985) or (n>=14330 and n<14335) or (n>=17130 and n<17135) or (n>=17480 and n<17485)) and 1 or 0)
 p[':kbd:a500_us:META'].fields['Right Amiga']:set_value(n>=3100 and n<3110 and 1 or 0)
 p[':kbd:a500_us:ROW9'].fields['o  O  ø Ø']:set_value(n>=3100 and n<3110 and 1 or 0)
 p[':cia_0_port_a'].fields['P1 Button 1']:set_value(((n>=14440 and n<14510) or ((n>=3030 and n<3035) or (n>=3040 and n<3045) or (n>=4140 and n<4145) or (n>=4160 and n<4165) or (n>=8640 and n<8645) or (n>=12160 and n<12165) or (n>=13340 and n<13345) or (n>=13530 and n<13535) or (n>=13580 and n<13585) or (n>=13630 and n<13635) or (n>=13680 and n<13685) or (n>=13730 and n<13735) or (n>=13780 and n<13785) or (n>=13830 and n<13835) or (n>=13930 and n<13935) or (n>=13980 and n<13985) or (n>=14330 and n<14335) or (n>=17130 and n<17135) or (n>=17480 and n<17485))) and 1 or 0)
 if n==13100 or n==13400 or n==13540 or n==13840 or n==14000 or n==14200 or n==14600 or n==17000 or n==17400 or n==17580 then manager.machine.screens[':screen']:snapshot('observe-'..n..'.png') end
 if n==17740 then manager.machine:exit() end
end,'frame')
