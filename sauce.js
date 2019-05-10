// define our lang-lang source file and export as "sauce"

let sauce = `

route ArrowLeft leftHandle
route ArrowRight rightHandle
route ArrowUp upHandle
route ArrowDown downHandle

route ~blink~ blinkHandle

cp 7 N

loop 1 N

cp N k
sub %1 k k
add 1 k k
mov k snk./%1/.x
cp 1 snk./%1/.y

pool

cp 180 grey

call chooseWhitePill

call drawModel

cp 1 state


stop


cp 1 state :: rightHandle
stop

cp 2 state :: leftHandle
stop

cp 3 state :: upHandle
stop

cp 4 state :: downHandle
stop

// :: blinkHandle

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


if x == 31
cp 1 x
fi
if y == 31
cp 1 y
fi
if x == 0
cp 30 x
fi
if y == 0
cp 30 y
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


if xhead && yhead
call chooseWhitePill
fi



call drawModel

stop


// :: drawModel
black
loop 1 snk.*len*
  draw grey snk./%1/.x snk./%1/.y
pool

draw 255 whitepill.x whitepill.y
back


// :: chooseWhitePill
cp true test

lip test

rngi 30 xrand
rngi 30 yrand

cp false match
loop 1 snk.*len*
== xrand snk./%1/.x xmatch
== yrand snk./%1/.y ymatch
cp false xmatch
cp false ymatch

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







`








// just like injections, let's automatically add stop to sauce
sauce += "\nstop";
	
		
console.log(`The sauce:`);
console.log(sauce);