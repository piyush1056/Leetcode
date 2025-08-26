import { useForm } from 'react-hook-form';

function Signup() {
 
      const { register,handleSubmit,formState: { errors },} = useForm();
return(
  
    <>
    
     <form onSubmit={handleSubmit((data) => console.log(data))}>

        <input {...register('firstName')} />
        <input {...register('emailId')} />
        <input {...register('password')} />


     </form>

     </>
)

}
 

export default Signup;