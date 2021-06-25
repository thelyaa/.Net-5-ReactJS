using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Data.SqlClient;
using System.Data;

namespace webApplication.Controllers
{
    [ApiController]
    public class APIController : ControllerBase
    {
        private readonly ILogger<APIController> _logger;

        //static readonly Models.IUserRepository repository = new Models.UserRepository();

        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        public APIController(ILogger<APIController> logger)
        {
            _logger = logger;
        }

        //[HttpGet]
        //public IEnumerable<WeatherForecast> Get()
        //{
        //    var rng = new Random();
        //    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //    {
        //        Date = DateTime.Now.AddDays(index),
        //        TemperatureC = rng.Next(-20, 55),
        //        Summary = Summaries[rng.Next(Summaries.Length)]
        //    })
        //    .ToArray();
        //}
        //public SqlCommand ConnectToDB(string req)
        //{
           
           
        //    return cmd;
        //}

        [HttpPost("signIn")]
        [Consumes("application/json")]
        public Users SignInFunction(Users data) 
        {
            string req = "Select * From Users Where Email = '" + data.Email + "' and Password = '" + data.Password + "';";
            SqlConnection con = new SqlConnection(@"Data Source=DESKTOP-K3CULB3\SQLEXPRESS;Initial Catalog=React_Net5;Integrated Security=True");
            con.Open();
            SqlCommand cmd = con.CreateCommand();
            cmd.CommandType = CommandType.Text;
            cmd.CommandText = req;
            Console.WriteLine(data.Email + data.Password);

            //var user = cmd.ExecuteScalar().ToString();
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            da.Fill(dt);

            Users userdata = new Users();
            DataTableReader dtreader = dt.CreateDataReader();
            while (dtreader.Read())
            {
                userdata.Id = dtreader["_id"].ToString();
                userdata.Email = dtreader["Email"].ToString();
                userdata.Password = dtreader["Password"].ToString();
                userdata.FirstName = dtreader["FirstName"].ToString();
                userdata.LastName = dtreader["LastName"].ToString();
                userdata.Phone = dtreader["Phone"].ToString();
                userdata.Role = dtreader["RoleId"].ToString();
            }
            con.Close();
                //Console.WriteLine(user);
            return userdata;
        }

        [HttpPost("usersList")]
        [Consumes("application/json")]
        public List<Users> GetUsersList(Users data)
        {
            SqlConnection con = new SqlConnection(@"Data Source=DESKTOP-K3CULB3\SQLEXPRESS;Initial Catalog=React_Net5;Integrated Security=True");
            con.Open();
            SqlCommand cmd = con.CreateCommand();
            cmd.CommandType = CommandType.Text;
            var req = "";
            Console.WriteLine(data.Role);
            if (data.Role == "2")
            {
                req = "Select * From Users Where RoleId <> 1;";
            }
            else if (data.Role == "3") req = "Select * From Users Where RoleId = 3;";
            else req = "Select * From Users;";
            
            cmd.CommandText = req;
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            da.Fill(dt);

            List<Users> list = new List<Users>();
            DataTableReader dtreader = dt.CreateDataReader();
            while (dtreader.Read())
            {
                Users userslist = new Users();
                userslist.Id = dtreader["_id"].ToString();
                userslist.Email = dtreader["Email"].ToString();
                userslist.Password = dtreader["Password"].ToString();
                userslist.FirstName = dtreader["FirstName"].ToString();
                userslist.LastName = dtreader["LastName"].ToString();
                userslist.Phone = dtreader["Phone"].ToString();
                userslist.Role = dtreader["RoleId"].ToString();
                list.Add(userslist);
            }
            con.Close();
            //Console.WriteLine(user);
            return list;
        }

        [HttpPost("editUser")]
        [Consumes("application/json")]
        public string editUserInfo(Users data)
        {
            SqlConnection con = new SqlConnection(@"Data Source=DESKTOP-K3CULB3\SQLEXPRESS;Initial Catalog=React_Net5;Integrated Security=True");
            con.Open();
            SqlCommand cmd = con.CreateCommand();
            cmd.CommandType = CommandType.Text;
            Console.WriteLine(data.Id);
            cmd.CommandText = "Update Users set Email='" + data.Email + "', FirstName='" + data.FirstName + "', LastName='" + data.LastName + "', Phone='" + data.Phone + "' Where _id='" + data.Id + "';";
            cmd.ExecuteNonQuery();

            return "success";
        }

        [HttpPost("updatePassword")]
        [Consumes("application/json")]
        public string editPassword(Users data)
        {
            SqlConnection con = new SqlConnection(@"Data Source=DESKTOP-K3CULB3\SQLEXPRESS;Initial Catalog=React_Net5;Integrated Security=True");
            con.Open();
            SqlCommand cmd = con.CreateCommand();
            cmd.CommandType = CommandType.Text;
            Console.WriteLine(data.Id);
            cmd.CommandText = "Update Users set Password='" + data.Password + "' Where _id='" + data.Id + "';";
            cmd.ExecuteNonQuery();

            return "success";
        }

        [HttpPost("getUserInfo")]
        [Consumes("application/json")]
        public Users getUserInfoFunction(Users data)
        {
            SqlConnection con = new SqlConnection(@"Data Source=DESKTOP-K3CULB3\SQLEXPRESS;Initial Catalog=React_Net5;Integrated Security=True");
            con.Open();
            SqlCommand cmd = con.CreateCommand();
            cmd.CommandType = CommandType.Text;
            Console.WriteLine(data.Id);
            cmd.CommandText = "Select * From Users Where _id = '" + data.Id + "';";

            SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            da.Fill(dt);

            Users userdata = new Users();
            DataTableReader dtreader = dt.CreateDataReader();
            while (dtreader.Read())
            {
                userdata.Id = dtreader["_id"].ToString();
                userdata.Email = dtreader["Email"].ToString();
                userdata.Password = dtreader["Password"].ToString();
                userdata.FirstName = dtreader["FirstName"].ToString();
                userdata.LastName = dtreader["LastName"].ToString();
                userdata.Phone = dtreader["Phone"].ToString();
                userdata.Role = dtreader["RoleId"].ToString();
            }
            con.Close();
            //Console.WriteLine(user);
            return userdata;
        }

        [HttpPost("createUser")]
        [Consumes("application/json")]
        public string createUser(Users user)
        {
            SqlConnection con = new SqlConnection(@"Data Source=DESKTOP-K3CULB3\SQLEXPRESS;Initial Catalog=React_Net5;Integrated Security=True");
            con.Open();
            SqlCommand cmd = con.CreateCommand();
            cmd.CommandType = CommandType.Text;
            Console.WriteLine(user);
            cmd.CommandText = "Insert into Users Values('"+ user.Email +"', '" + user.Password + "', '" + user.FirstName + "', '" + user.LastName + "', '" + user.Phone + "', '" + user.Role +"');";
            cmd.ExecuteNonQuery();
            return "success";
        }

        [HttpPost("deleteUser")]
        [Consumes("application/json")]
        public string deleteeUser(Users user)
        {
            SqlConnection con = new SqlConnection(@"Data Source=DESKTOP-K3CULB3\SQLEXPRESS;Initial Catalog=React_Net5;Integrated Security=True");
            con.Open();
            SqlCommand cmd = con.CreateCommand();
            cmd.CommandType = CommandType.Text;
            Console.WriteLine(user);
            cmd.CommandText = "Delete From Users Where _id='"+user.Id+"';";
            cmd.ExecuteNonQuery();
            return "success";
        }
    }
}
