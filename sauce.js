// define our lang-lang source file and export as "sauce"

let sauce7 = `

cp true test

lip test

rngi 20 a
log a
if a == 10
cp false test
fi

pil


cp 7 N

loop 1 N

cp N k
sub %1 k k
add 1 k k
mov k snk./%1/.x
cp 1 snk./%1/.y

pool

cp 180 grey

call drawSnake
call chooseWhitePill

stop

// :: drawSnake
black
loop 1 N
  draw grey snk./%1/.x snk./%1/.y
pool
back

// :: chooseWhitePill
cp true test

lip test

rngi 30 xrand
rngi 30 yrand

cp false match
loop 1 snk.*len*
log %1
== xrand snk./%1/.x xmatch
== yrand snk./%1/.y ymatch

log "x and y match booleans:"
log xmatch
log ymatch
sleep

if xmatch && ymatch
log "found a double match"
cp true match
fi
pool

! match nomatch

log "nomatch is:"
log nomatch

if nomatch
mov xrand whitepill.x
mov yrand whitepill.y
cp false test
fi

pil

back



`

let sauce2 = `

call first_function
log alittlestring
call first_function
log blittlestring
stop

// :: first_function
log in_first_function_yay
back

`;

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


sub 1 N p
loop 1 p

sub %1 N r
add 1 r s
mov snk./r/ snk./s/

pool



mov x snk.head.x
mov y snk.head.y
mov snk.head snk.1

call drawModel

stop


// :: drawModel
black
loop 1 N
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