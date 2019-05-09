// define our lang-lang source file and export as "sauce"

const sauce2 = `

call first_function
log alittlestring
call first_function
log blittlestring
stop

// :: first_function
log in_first_function_yay
back

`;

const sauce = `

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
call drawSnake

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


// XXX ahh I goofed it's fine 

sub 1 N p
loop 1 p

sub %1 N r
add 1 r s
mov snk./r/ snk./s/

pool




mov x snk.head.x
mov y snk.head.y
mov snk.head snk.1

call drawSnake

stop


// :: drawSnake
black
loop 1 N
  draw grey snk./%1/.x snk./%1/.y
pool
back



`
	
		
console.log(`The sauce:`);
console.log(sauce);