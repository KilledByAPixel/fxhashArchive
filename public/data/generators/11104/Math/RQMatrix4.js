class RQMatrix4
{
	constructor()
	{
		this.m_a = [];
		this.M_setIdentity();
					
	}
	M_setIdentity()
	{
		for(let i=0; i<16; i++)
		{
			this.m_a[i] = ((i%4)==(parseInt(i/4)))? 1.0 : 0.0; 
		
		}
	
	
	}
	M_copyFrom(M)
	{
		for(let i=0; i<16; i++)
		{
			this.m_a[i] = M.m_a[i];
		}
	}
	clone()
	{
		var M = new RQMatrix4();
		M.M_copyFrom(this);
		return M;	
	}

	//------------------------------------------------------------------------
	// M_setRotationMatrix
	// Set the rotation components of a 4x4 matrix
	//------------------------------------------------------------------------
	M_setRotationMatrix( angleDeg, x, y, z)
	{
		var radians, c, s, c1, length;
		var u = [];	//3
		var i, j;
		
		radians = (angleDeg * Math.PI) / 180.0;
		
		c = Math.cos(radians);
		s = Math.sin(radians);
		
		c1 = 1.0 - Math.cos(radians);
		
		length = Math.hypot(x,y,z);
		
		u[0] = x / length;
		u[1] = y / length;
		u[2] = z / length;
		
		for (i = 0; i < 16; i++) {
			this.m_a[i] = 0.0;
		}
		
		this.m_a[15] = 1.0;
		
		for (i = 0; i < 3; i++) {
			this.m_a[i * 4 + (i + 1) % 3] = u[(i + 2) % 3] * s;
			this.m_a[i * 4 + (i + 2) % 3] = -u[(i + 1) % 3] * s;
		}
		
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {
				this.m_a[i * 4 + j] += c1 * u[i] * u[j] + (i == j ? c : 0.0);
			}
		}
	}
	// M_rotate
	// Applies a rotation
	M_rotate(angleDeg, x, y, z)
	{
		let rotateMatrix = new RQMatrix4();
		rotateMatrix.M_setRotationMatrix(angleDeg, x, y, z);
			
		// matrix * scale_matrix
		let M = this.M_multipliedByMatrix(rotateMatrix);
		this.M_copyFrom(M);
		return this;
	}
	// M_multipliedByMatrix
	M_multipliedByMatrix(mat)
	{
		var result = new RQMatrix4();
		result.m_a[ 0] =mat.m_a[ 0]*this.m_a[0] +mat.m_a[1]*this.m_a[4] +mat.m_a[2]*this.m_a[ 8] +mat.m_a[3]*this.m_a[12];
		result.m_a[ 1] =mat.m_a[ 0]*this.m_a[1] +mat.m_a[1]*this.m_a[5] +mat.m_a[2]*this.m_a[ 9] +mat.m_a[3]*this.m_a[13];
		result.m_a[ 2] =mat.m_a[ 0]*this.m_a[2] +mat.m_a[1]*this.m_a[6] +mat.m_a[2]*this.m_a[10] +mat.m_a[3]*this.m_a[14];
		result.m_a[ 3] =mat.m_a[ 0]*this.m_a[3] +mat.m_a[1]*this.m_a[7] +mat.m_a[2]*this.m_a[11] +mat.m_a[3]*this.m_a[15];
	
		result.m_a[ 4] =mat.m_a[ 4]*this.m_a[0] +mat.m_a[ 5]*this.m_a[4] +mat.m_a[6]*this.m_a[ 8] +mat.m_a[7]*this.m_a[12];
		result.m_a[ 5] =mat.m_a[ 4]*this.m_a[1] +mat.m_a[ 5]*this.m_a[5] +mat.m_a[6]*this.m_a[ 9] +mat.m_a[7]*this.m_a[13];
		result.m_a[ 6] =mat.m_a[ 4]*this.m_a[2] +mat.m_a[ 5]*this.m_a[6] +mat.m_a[6]*this.m_a[10] +mat.m_a[7]*this.m_a[14];
		result.m_a[ 7] =mat.m_a[ 4]*this.m_a[3] +mat.m_a[ 5]*this.m_a[7] +mat.m_a[6]*this.m_a[11] +mat.m_a[7]*this.m_a[15];
	
		result.m_a[ 8] =mat.m_a[ 8]*this.m_a[0] +mat.m_a[ 9]*this.m_a[4] +mat.m_a[10]*this.m_a[ 8] +mat.m_a[11]*this.m_a[12];
		result.m_a[ 9] =mat.m_a[ 8]*this.m_a[1] +mat.m_a[ 9]*this.m_a[5] +mat.m_a[10]*this.m_a[ 9] +mat.m_a[11]*this.m_a[13];
		result.m_a[10] =mat.m_a[ 8]*this.m_a[2] +mat.m_a[ 9]*this.m_a[6] +mat.m_a[10]*this.m_a[10] +mat.m_a[11]*this.m_a[14];
		result.m_a[11] =mat.m_a[ 8]*this.m_a[3] +mat.m_a[ 9]*this.m_a[7] +mat.m_a[10]*this.m_a[11] +mat.m_a[11]*this.m_a[15];
	
		result.m_a[12] =mat.m_a[12]*this.m_a[0] +mat.m_a[13]*this.m_a[4] +mat.m_a[14]*this.m_a[ 8] +mat.m_a[15]*this.m_a[12];
		result.m_a[13] =mat.m_a[12]*this.m_a[1] +mat.m_a[13]*this.m_a[5] +mat.m_a[14]*this.m_a[ 9] +mat.m_a[15]*this.m_a[13];
		result.m_a[14] =mat.m_a[12]*this.m_a[2] +mat.m_a[13]*this.m_a[6] +mat.m_a[14]*this.m_a[10] +mat.m_a[15]*this.m_a[14];
		result.m_a[15] =mat.m_a[12]*this.m_a[3] +mat.m_a[13]*this.m_a[7] +mat.m_a[14]*this.m_a[11] +mat.m_a[15]*this.m_a[15];		
		return result;
	}	
	
	// returns: RQVec3 with additional w
	M_mutlipliedByVector(v)
	{
		v.w??=1;
		var result = new RQVec3();
		result.x = this.m_a[0]*v.x + this.m_a[4]*v.y + this.m_a[8 ]*v.z + this.m_a[12]*v.w;
		result.y = this.m_a[1]*v.x + this.m_a[5]*v.y + this.m_a[9 ]*v.z + this.m_a[13]*v.w;
		result.z = this.m_a[2]*v.x + this.m_a[6]*v.y + this.m_a[10]*v.z + this.m_a[14]*v.w;
		result.w = this.m_a[3]*v.x + this.m_a[7]*v.y + this.m_a[11]*v.z + this.m_a[15]*v.w;
		return result;
	}
	
	// M_rotateVector
	// applies the rotation only to a RQVec3
	// returns a rotated RQVec3
	M_rotateVector(v)
	{
		let result = new RQVec3();
		result.x = this.m_a[0]*v.x + this.m_a[4]*v.y + this.m_a[8 ]*v.z;
		result.y = this.m_a[1]*v.x + this.m_a[5]*v.y + this.m_a[9 ]*v.z;
		result.z = this.m_a[2]*v.x + this.m_a[6]*v.y + this.m_a[10]*v.z;
		return result;
	}
	// return the z component of a rotated vector
	M_getRotateZ(v)
	{
		return this.m_a[2]*v.x + this.m_a[6]*v.y + this.m_a[10]*v.z;
	
	}

	M_getTranslation() 
	{
		return new RQVec3(this.m_a[12],this.m_a[13],this.m_a[14]);

	}
	M_setTranslation(x,y,z) 
	{
		if( typeof x==='object')
		{
			z=x.z;
			y=x.y;
			x=x.x;
		}
		this.m_a[12]=x;
		this.m_a[13]=y;
		this.m_a[14]=z;

	}



	// M_translate
	M_translate( x,y,z)
	{
		if( typeof x==='object')
		{
			z=x.z;
			y=x.y;
			x=x.x;
		}

		// matrix * translate_matrix
		this.m_a[12] += (this.m_a[0] * x + this.m_a[4] * y + this.m_a[8]  * z);
		this.m_a[13] += (this.m_a[1] * x + this.m_a[5] * y + this.m_a[9]  * z);
		this.m_a[14] += (this.m_a[2] * x + this.m_a[6] * y + this.m_a[10] * z);
		this.m_a[15] += (this.m_a[3] * x + this.m_a[7] * y + this.m_a[11] * z);
		return this;
	}
	//  M_scale
	M_scale(x,y,z)
	{
		if( y==undefined || z==undefined)
		{	y=z=x; 
		}
		this.m_a[0]  *= x;
		this.m_a[1]  *= x;
		this.m_a[2]  *= x;
		this.m_a[3]  *= x;
		
		this.m_a[4]  *= y;
		this.m_a[5]  *= y;
		this.m_a[6]  *= y;
		this.m_a[7]  *= y;
		
		this.m_a[8]  *= z;
		this.m_a[9]  *= z;
		this.m_a[10] *= z;
		this.m_a[11] *= z;
		return this;
	}
	M_setBase(I,J,K)
	{
		this.m_a[0]	= I.x;
		this.m_a[1]	= I.y;
		this.m_a[2]	= I.z;
		
		this.m_a[4]	= J.x;
		this.m_a[5]	= J.y;
		this.m_a[6]	= J.z;
		
		this.m_a[8]	= K.x;
		this.m_a[9]	= K.y;
		this.m_a[10]= K.z;
		
		return this;
	}
	
	
	M_getString()
	{
		var s="\n";
		for(let j=0; j<4; j++)
		{	for(let i=0; i<4; i++)
			{ s+=this.m_a[i+j*4].toPrecision(6)+" ";
			}
			s+="\n";
		}
		return s;
	
	}
}
