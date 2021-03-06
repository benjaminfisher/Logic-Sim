SocketFace = new Object();

SocketFace.left 	= "LEFT";
SocketFace.top 		= "TOP";
SocketFace.right 	= "RIGHT";
SocketFace.bottom 	= "BOTTOM";

function SocketInfo( face, offset, label )
{
	this.face = face;
	this.offset = offset;
	this.label = label;
	
	this.isLeft 	= this.face == SocketFace.left;
	this.isTop 		= this.face == SocketFace.top;
	this.isRight 	= this.face == SocketFace.right;
	this.isBottom 	= this.face == SocketFace.bottom;
	
	this.getPosition = function( gateType, x, y )
	{
		return new Pos(
			x + 
			( ( this.face == SocketFace.left ) ? 0
			: ( this.face == SocketFace.right ) ? gateType.width
			: this.offset * 8 ),
			y +
			( ( this.face == SocketFace.top ) ? 0
			: ( this.face == SocketFace.bottom ) ? gateType.height
			: this.offset * 8 )
		);
	}
}

function GateType( name, width, height, inputs, outputs )
{
	this.name = name;

	this.width = width;
	this.height = height;
	
	this.inputs = inputs;
	this.outputs = outputs;
	
	this.func = function( gate, inputs )
	{
		return [ false ];
	}
	
	this.initialize = function( gate )
	{
		
	}
	
	this.click = function( gate )
	{
		
	}
	
	this.mouseDown = function( gate )
	{
	
	}
	
	this.mouseUp = function( gate )
	{
	
	}
	
	this.render = function( context, x, y, gate )
	{
		context.strokeStyle = "#000000";
		context.lineWidth = 2;
		
		for( var i = 0; i < inputs.length + outputs.length; ++ i )
		{
			var inp = ( i < inputs.length ? inputs[ i ] : outputs[ i - inputs.length ] );
			var start = inp.getPosition( this, x, y );
			var end = inp.getPosition( this, x, y );
			
			if( inp.face == SocketFace.left || inp.face == SocketFace.right )
				end.x = x + this.width / 2;
			else
				end.y = y + this.height / 2;
				
			context.beginPath();
			context.moveTo( start.x, start.y );
			context.lineTo( end.x, end.y );
			context.stroke();
			context.closePath();
		}
	}
}

function DefaultGate( name, image, renderOverride, inputs, outputs )
{
	this.__proto__ = new GateType( name, image.width, image.height, inputs, outputs );
	
	this.image = image;
	this.renderOverride = renderOverride;
	
	this.render = function( context, x, y, gate )
	{
		this.__proto__.render( context, x, y, gate );
		if( !this.renderOverride )
			context.drawImage( this.image, x, y );
	}
}

function BufferGate()
{
	this.__proto__ = new DefaultGate( "BUF", images.buffer, false,
		[ 
			new SocketInfo( SocketFace.left, 2, "A" )
		],
		[ 
			new SocketInfo( SocketFace.right, 2, "Q" )
		]
	);
	
	this.func = function( gate, inputs )
	{
		return [ inputs[ 0 ] ];
	}
}

function AndGate()
{
	this.__proto__ = new DefaultGate( "AND", images.and, false,
		[ 
			new SocketInfo( SocketFace.left, 1, "A" ),
			new SocketInfo( SocketFace.left, 3, "B" )
		],
		[ 
			new SocketInfo( SocketFace.right, 2, "Q" )
		]
	);
	
	this.func = function( gate, inputs )
	{
		return [ inputs[ 0 ] && inputs[ 1 ] ];
	}
}

function OrGate()
{
	this.__proto__ = new DefaultGate( "OR", images.or, false,
		[ 
			new SocketInfo( SocketFace.left, 1, "A" ),
			new SocketInfo( SocketFace.left, 3, "B" )
		],
		[ 
			new SocketInfo( SocketFace.right, 2, "Q" )
		]
	);
	
	this.func = function( gate, inputs )
	{
		return [ inputs[ 0 ] || inputs[ 1 ] ];
	}
}

function XorGate()
{
	this.__proto__ = new DefaultGate( "XOR", images.xor, false,
		[ 
			new SocketInfo( SocketFace.left, 1, "A" ),
			new SocketInfo( SocketFace.left, 3, "B" )
		],
		[ 
			new SocketInfo( SocketFace.right, 2, "Q" )
		]
	);
	
	this.func = function( gate, inputs )
	{
		return [ inputs[ 0 ] ^ inputs[ 1 ] ];
	}
}

function NotGate()
{
	this.__proto__ = new DefaultGate( "NOT", images.not, false,
		[ 
			new SocketInfo( SocketFace.left, 2, "A" )
		],
		[ 
			new SocketInfo( SocketFace.right, 2, "Q" )
		]
	);
	
	this.func = function( gate, inputs )
	{
		return [ !inputs[ 0 ] ];
	}
}

function NandGate()
{
	this.__proto__ = new DefaultGate( "NAND", images.nand, false,
		[ 
			new SocketInfo( SocketFace.left, 1, "A" ),
			new SocketInfo( SocketFace.left, 3, "B" )
		],
		[ 
			new SocketInfo( SocketFace.right, 2, "Q" )
		]
	);
	
	this.func = function( gate, inputs )
	{
		return [ !inputs[ 0 ] || !inputs[ 1 ] ];
	}
}

function NorGate()
{
	this.__proto__ = new DefaultGate( "NOR", images.nor, false,
		[ 
			new SocketInfo( SocketFace.left, 1, "A" ),
			new SocketInfo( SocketFace.left, 3, "B" )
		],
		[ 
			new SocketInfo( SocketFace.right, 2, "Q" )
		]
	);
	
	this.func = function( gate, inputs )
	{
		return [ !inputs[ 0 ] && !inputs[ 1 ] ];
	}
}

function XnorGate()
{
	this.__proto__ = new DefaultGate( "XNOR", images.xnor, false,
		[ 
			new SocketInfo( SocketFace.left, 1, "A" ),
			new SocketInfo( SocketFace.left, 3, "B" )
		],
		[ 
			new SocketInfo( SocketFace.right, 2, "Q" )
		]
	);
	
	this.func = function( gate, inputs )
	{
		return [ inputs[ 0 ] == inputs[ 1 ] ];
	}
}

function ConstInput()
{
	this.onImage = images.conston;
	this.offImage = images.constoff;
	
	this.__proto__ = new DefaultGate( "IN", images.conston, true, [],
		[ 
			new SocketInfo( SocketFace.right, 2, "Q" )
		]
	);
	
	this.initialize = function( gate )
	{
		gate.on = false;
	}
	
	this.click = function( gate )
	{
		gate.on = !gate.on;
	}
	
	this.func = function( gate, inputs )
	{
		return [ gate.on ];
	}
	
	this.render = function( context, x, y, gate )
	{
		this.__proto__.render( context, x, y );
		context.drawImage( gate != null && gate.on ? this.onImage : this.offImage, x, y );
	}
}

function ClockInput()
{
	this.__proto__ = new DefaultGate( "CLOCK", images.clock, false, [],
		[ 
			new SocketInfo( SocketFace.right, 2, "Q" )
		]
	);
	
	this.func = function( gate, inputs )
	{
		var period = 1000 / gate.freq;
		return [ new Date().getTime() % period >= period / 2 ];
	}
	
	this.initialize = function( gate )
	{
		gate.freq = 1;
	}
	
	this.click = function( gate )
	{
		gate.freq *= 2;
		
		if( gate.freq >= 32 )
			gate.freq = 0.125;
	}
}

function ToggleSwitch()
{
	this.openImage = images.switchopen;
	this.closedImage = images.switchclosed;

	this.__proto__ = new DefaultGate( "TSWITCH", this.openImage, true,
		[
			new SocketInfo( SocketFace.left, 2, "A" ),
		],
		[ 
			new SocketInfo( SocketFace.right, 2, "Q" )
		]
	);
	
	this.func = function( gate, inputs )
	{
		return [ !gate.open && inputs[ 0 ] ];
	}
	
	this.initialize = function( gate )
	{
		gate.open = true;
	}
	
	this.click = function( gate )
	{
		gate.open = !gate.open;
	}
	
	this.render = function( context, x, y, gate )
	{
		this.__proto__.render( context, x, y );
		context.drawImage( gate == null || gate.open ? this.openImage : this.closedImage, x, y );
	}
}

function PushSwitchA()
{
	this.openImage = images.pushswitchaopen;
	this.closedImage = images.pushswitchaclosed;

	this.__proto__ = new DefaultGate( "PSWITCHA", this.openImage, true,
		[
			new SocketInfo( SocketFace.left, 2, "A" ),
		],
		[ 
			new SocketInfo( SocketFace.right, 2, "Q" )
		]
	);
	
	this.func = function( gate, inputs )
	{
		return [ !gate.open && inputs[ 0 ] ];
	}
	
	this.initialize = function( gate )
	{
		gate.open = true;
	}
	
	this.mouseDown = function( gate )
	{
		gate.open = false;
	}
	
	this.mouseUp = function( gate )
	{
		gate.open = true;
	}
	
	this.render = function( context, x, y, gate )
	{
		this.__proto__.render( context, x, y );
		context.drawImage( gate == null || gate.open ? this.openImage : this.closedImage, x, y );
	}
}

function PushSwitchB()
{
	this.openImage = images.pushswitchbopen;
	this.closedImage = images.pushswitchbclosed;

	this.__proto__ = new DefaultGate( "PSWITCHB", this.closedImage, true,
		[
			new SocketInfo( SocketFace.left, 2, "A" ),
		],
		[ 
			new SocketInfo( SocketFace.right, 2, "Q" )
		]
	);
	
	this.func = function( gate, inputs )
	{
		return [ !gate.open && inputs[ 0 ] ];
	}
	
	this.initialize = function( gate )
	{
		gate.open = false;
	}
	
	this.mouseDown = function( gate )
	{
		gate.open = true;
	}
	
	this.mouseUp = function( gate )
	{
		gate.open = false;
	}
	
	this.render = function( context, x, y, gate )
	{
		this.__proto__.render( context, x, y );
		context.drawImage( gate != null && gate.open ? this.openImage : this.closedImage, x, y );
	}
}

function OutputDisplay()
{
	this.onImage = images.outon;
	this.offImage = images.outoff;

	this.__proto__ = new DefaultGate( "OUT", this.onImage, true,
		[
			new SocketInfo( SocketFace.left, 2, "A" ),
		],
		[]
	);
	
	this.func = function( gate, inputs )
	{
		gate.on = inputs[ 0 ];
		return [];
	}
	
	this.initialize = function( gate )
	{
		gate.on = false;
	}
	
	this.render = function( context, x, y, gate )
	{
		this.__proto__.render( context, x, y );
		context.drawImage( gate == null || !gate.on ? this.offImage : this.onImage, x, y );
	}
}

function SevenSegDisplay()
{
	this.baseImage = images.sevsegbase;
	this.segImages =
	[
		images.sevsega, images.sevsegb, images.sevsegc, images.sevsegdp,
		images.sevsegd, images.sevsege, images.sevsegf, images.sevsegg
	];

	this.__proto__ = new DefaultGate( "SEVSEG", this.baseImage, true,
		[
			new SocketInfo( SocketFace.right, 2, "A" ),
			new SocketInfo( SocketFace.right, 4, "B" ),
			new SocketInfo( SocketFace.right, 6, "C" ),
			new SocketInfo( SocketFace.right, 8, "DP" ),
			new SocketInfo( SocketFace.left,  8, "D" ),
			new SocketInfo( SocketFace.left,  6, "E" ),
			new SocketInfo( SocketFace.left,  4, "F" ),
			new SocketInfo( SocketFace.left,  2, "G" )
		],
		[]
	);
	
	this.func = function( gate, inputs )
	{
		gate.active = inputs;
		return [];
	}
	
	this.initialize = function( gate )
	{
		gate.active = [ false, false, false, false, false, false, false, false ];
	}
	
	this.render = function( context, x, y, gate )
	{
		this.__proto__.render( context, x, y );
		context.drawImage( this.baseImage, x, y );
		
		if( gate != null )
			for( var i = 0; i < 8; ++ i )
				if( gate.active[ i ] )
					context.drawImage( this.segImages[ i ], x, y );
	}
}

function Link( gate, socket )
{
	this.gate = gate;
	this.socket = socket;
	
	this.getValue = function()
	{
		return this.gate.getOutput( this.socket );
	}
	
	this.equals = function( obj )
	{
		return this.gate == obj.gate && this.socket == obj.socket;
	}
}

function Gate( gateType, x, y )
{
	var myOutputs = new Array();
	var myNextOutputs = new Array();
	var myInLinks = new Array();
	
	this.type = gateType;
	
	this.x = x;
	this.y = y;
	
	this.isMouseDown = false;
	
	this.width = this.type.width;
	this.height = this.type.height;
	
	this.inputs = this.type.inputs;
	this.outputs = this.type.outputs;
	
	for( var i = 0; i < this.type.inputs.length; ++i )
		myInLinks[ i ] = null;
	
	for( var i = 0; i < this.type.outputs.length; ++i )
		myOutputs[ i ] = false;
	
	this.getRect = function( gridSize )
	{
		if( !gridSize )
			gridSize = 1;
	
		var rl = Math.round( this.x );
		var rt = Math.round( this.y );
		var rr = Math.round( this.x + this.width );
		var rb = Math.round( this.y + this.height );
		
		rl = Math.floor( rl / gridSize ) * gridSize;
		rt = Math.floor( rt / gridSize ) * gridSize;
		rr = Math.ceil( rr / gridSize ) * gridSize;
		rb = Math.ceil( rb / gridSize ) * gridSize;
		
		return new Rect( rl, rt, rr - rl, rb - rt );
	}
	
	this.linkInput = function( gate, output, input )
	{
		var index = this.inputs.indexOf( input );
		myInLinks[ index ] = new Link( gate, output );
	}
	
	this.isLinked = function( gate )
	{
		for( var i = 0; i < this.inputs.length; ++ i )
			if( myInLinks[ i ] != null && myInLinks[ i ].gate == gate )
				return true;
		
		return false;
	}
	
	this.unlinkGate = function( gate )
	{
		for( var i = 0; i < this.inputs.length; ++ i )
			if( myInLinks[ i ] != null && myInLinks[ i ].gate == gate )
				myInLinks[ i ] = null;
	}
	
	this.unlinkInput = function( input )
	{
		var index = this.inputs.indexOf( input );
		myInLinks[ index ] = null;
	}
	
	this.getOutput = function( output )
	{
		var index = this.outputs.indexOf( output );
		return myOutputs[ index ];
	}
	
	this.click = function()
	{
		this.type.click( this );
	}
	
	this.mouseDown = function()
	{
		this.isMouseDown = true;
		this.type.mouseDown( this );
	}
	
	this.mouseUp = function()
	{
		this.isMouseDown = false;
		this.type.mouseUp( this );
	}
	
	this.step = function()
	{
		var inVals = new Array();
	
		for( var i = 0; i < this.inputs.length; ++ i )
		{
			var link = myInLinks[ i ];
			inVals[ i ] = ( myInLinks[ i ] == null )
				? false : link.getValue();
		}
		
		myNextOutputs = this.type.func( this, inVals );
	}
	
	this.commit = function()
	{
		myOutputs = myNextOutputs;
	}
	
	this.render = function( context )
	{
		this.type.render( context, this.x, this.y, this );
		
		context.strokeStyle = "#000000";
		context.lineWidth = 2;
		context.fillStyle = "#9999FF";
		
		for( var i = 0; i < this.inputs.length + this.outputs.length; ++ i )
		{
			var inp = ( i < this.inputs.length ? this.inputs[ i ]
				: this.outputs[ i - this.inputs.length ] );
			var pos = inp.getPosition( this.type, this.x, this.y );
				
			if( i < this.inputs.length )
			{
				if( myInLinks[ i ] != null )
					context.fillStyle = myInLinks[ i ].getValue() ? "#FF9999" : "#9999FF";
				else
					context.fillStyle = "#999999";
			}
			else
			{
				context.fillStyle = myOutputs[ i - this.inputs.length ]
					? "#FF9999" : "#9999FF";
			}
				
			context.beginPath();
			context.arc( pos.x, pos.y, 4, 0, Math.PI * 2, true );
			context.fill();
			context.stroke();
			context.closePath();
		}
	}
	
	this.type.initialize( this );
}
