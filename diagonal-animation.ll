// Screen starts out all 0

cp 0 diff
loop 1 200
black
loop 1 30
  loop 1 30
    rngi 50 m
    if m < 20
      add 30 m m
    fi
    sub diff %2 var1
    if %1 == var1
      cp m S>%2>%1
    fi
    add diff %2 var2
    if %1 == var2
      cp m S>%2>%1
    fi
  pool
pool
add 1 diff diff
if diff == 30
	cp 0 diff
fi
sleep
pool

// moar