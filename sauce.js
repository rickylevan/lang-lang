// define our lang-lang source file and export as "sauce"

let sauce = `

route ArrowLeft leftHandle
route ArrowRight rightHandle
route ArrowUp upHandle
route ArrowDown downHandle

route ~blink~ blinkHandle


cp 30 SIZE
cp 7 N

loop 1 N

cp N k
sub %1 k k
add 1 k k
mov k snk./%1/.x
cp 1 snk./%1/.y

pool

cp false dead
cp 180 grey

cp 1 state

call chooseWhitePill

call drawModel

stop



// :: rightHandle
if state != 2
cp 1 state
fi
stop

// :: leftHandle
if state != 1
cp 2 state
fi
stop

// :: upHandle
if state != 4
cp 3 state
fi
stop

// :: downHandle
if state != 3
cp 4 state
fi
stop



// :: blinkHandle

if dead
stop
fi

cp false extend

cp snk.1.x x
cp snk.1.y y

if state == 1
add 1 x x
fi

if state == 2
sub 1 x x
fi

if state == 3
add 1 y y
fi

if state == 4
sub 1 y y
fi


if x > SIZE
cp 1 x
fi
if y > SIZE
cp 1 y
fi
if x == 0
cp SIZE x
fi
if y == 0
cp SIZE y
fi


== x whitepill.x xhead
== y whitepill.y yhead
if xhead && yhead
call chooseWhitePill
cp true extend
fi

cp 1 start
if extend
cp 0 start
fi

sub 1 snk.*len* p
if extend
inc p
fi

cp snk.*len* N
loop start p

sub %1 N r
add 1 r s
mov snk./r/ snk./s/

pool



mov x snk.head.x
mov y snk.head.y
mov snk.head snk.1


call checkSelfIntersect

call drawModel

stop




// :: drawModel

black
! dead alive

if alive
loop 1 snk.*len*
cp 102 color.g
cp 75 color.b
draw color snk./%1/.x snk./%1/.y
pool
fi

if dead
loop 1 snk.*len*
cp 255 color.r
cp 102 color.b
draw color snk./%1/.x snk./%1/.y
pool
fi

draw 230 whitepill.x whitepill.y
back





// :: chooseWhitePill

cp true test

lip test

rngi SIZE xrand
rngi SIZE yrand

cp false match
loop 1 snk.*len*
== xrand snk./%1/.x xmatch
== yrand snk./%1/.y ymatch

if xmatch && ymatch
cp true match
fi

pool

! match nomatch

if nomatch
mov xrand whitepill.x
mov yrand whitepill.y
cp false test
fi

pil

back





// :: checkSelfIntersect

sub 1 snk.*len* p
loop 1 p

add 1 %1 up

sub up snk.*len* nruns
inc nruns

loop up nruns

== snk./%1/.x snk./%2/.x xmatch
== snk./%1/.y snk./%2/.y ymatch


if xmatch && ymatch
cp true dead
fi


pool

pool

back









`








// just like injections, let's automatically add stop to sauce
sauce += "\nstop";
	
		
console.log(`The sauce:`);
console.log(sauce);